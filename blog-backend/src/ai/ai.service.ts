import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { Response } from 'express';
import { Readable } from 'stream';

interface Delta {
  content?: string;
}

interface Choice {
  delta: Delta;
}

interface Data {
  choices: Choice[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private apiKey: string;
  private readonly baseURL = 'https://api.moonshot.cn/v1';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('MOONSHOT_API_KEY');
    if (!apiKey) {
      throw new Error('MOONSHOT_API_KEY not found in configuration');
    }
    this.apiKey = apiKey;
  }

  private async createCompletion(messages: any[], res: Response): Promise<void> {
    try {
      const response = await axios.post<any>(
        `${this.baseURL}/chat/completions`,
        {
          model: 'moonshot-v1-8k',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'stream'
        }
      );

      // 设置 SSE 头部
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // 处理流式响应
      const dataStream = response.data as Readable;
      let buffer = ''; // 缓存不完整的数据块

      dataStream.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line === 'data: [DONE]') {
            // 处理结束信号
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            continue;
          }
          if (line.startsWith('data: ')) {
            const jsonData = line.slice(6); // 移除 'data: ' 前缀
            try {
              const data = JSON.parse(jsonData) as Data; // 使用类型断言
              if (data.choices && data.choices[0].delta) {
                const content = data.choices[0].delta.content;
                if (content) {
                  // 只发送实际的文本内容
                  res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
              }
            } catch (e) {
              console.error('解析数据失败:', e, '原始数据:', jsonData);
            }
          }
        }

        // 缓存最后一行，可能是不完整的数据
        buffer = lines[lines.length - 1];
      });

      dataStream.on('end', () => {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      });

      dataStream.on('error', (error) => {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      });

    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 429) {
        throw new HttpException('请求过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS);
      }
      throw new HttpException('AI 服务调用失败，请稍后重试', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async continueWriting(content: string, res: Response) {
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的文章写作助手，请基于用户提供的内容继续写作，保持风格连贯。'
      },
      {
        role: 'user',
        content: `请继续写作以下内容：\n\n${content}`
      }
    ];

    return this.createCompletion(messages, res);
  }

  async polish(content: string, res: Response) {
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的文章润色助手，请优化用户提供的内容，使其更加优美流畅，同时保持原意。'
      },
      {
        role: 'user',
        content: `请润色优化以下内容：\n\n${content}`
      }
    ];

    return this.createCompletion(messages, res);
  }

  async summarize(content: string, res: Response) {
    const messages = [
      {
        role: 'system',
        content: '你是一个专业的文章总结助手，请提取用户提供内容的主要观点和要点，生成简洁的摘要。'
      },
      {
        role: 'user',
        content: `请总结以下内容：\n\n${content}`
      }
    ];

    return this.createCompletion(messages, res);
  }

  async reply(content: string, res: Response) {
    const messages = [
      {
        role: 'system',
        content: '你是一个问题回答大师，请基于用户提供的内容生成回复。',
      },
      {
        role: 'user',
        content: `请回复以下内容：\n\n${content}`,
      },
    ];

    return this.createCompletion(messages, res);
  }
}