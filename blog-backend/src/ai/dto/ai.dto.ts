// src/ai/dto/ai.dto.ts
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AiRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}

export class AiResponseDto {
  success: boolean;
  data?: string;
  error?: string;
}