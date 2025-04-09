import { Buffer } from 'node:buffer'
import { Injectable } from '@nestjs/common'
import { compare, genSalt, hash } from 'bcryptjs'

@Injectable()
export class HashingService {
  // 异步哈希处理，统一转字符串
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt()
    return await hash(data.toString(), salt)
  }

  // 比较密码与哈希值
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    if (!data || !encrypted) {
      console.error('compare() received empty data:', { data, encrypted })
      return false
    }
    return await compare(data.toString(), encrypted)
  }
}
