import { Buffer } from 'node:buffer'
import { Injectable } from '@nestjs/common'
import { compare, genSalt, hash } from 'bcrypt'

@Injectable()
export class HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt()
    return hash(data, salt)
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    if (!data || !encrypted) {
      console.error('compare() received empty data:', { data, encrypted });
      return Promise.resolve(false);
    }
    return compare(data, encrypted)
  }
}
