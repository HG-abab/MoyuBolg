import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-gitee'
import { SocialLoginDto } from '../dto/auth.dto'


@Injectable()
export class GiteeStrategy extends PassportStrategy(Strategy, 'gitee') {
  constructor() {
    super({
      clientID: 'be146909078a6f9959aa8360ab583e0e6ba2e8a6a0939a3ce67947c024b9ab97',
      clientSecret: '48ede9691067235506d7aedbf0b11ea98aa5aa36b21dbdac23db700ee1fe0626',
      callbackURL: 'http://localhost:3000/auth/gitee/callback',
    })
  }

  validate(accessToken: string, refreshToken: string, profile: SocialLoginDto) {
    return {
      provider: 'gitee',
      providerId: profile.providerId,
      username: profile.name,
      email: profile.email || '',
      avatar: profile.avatar || '',
    }
  }
}
