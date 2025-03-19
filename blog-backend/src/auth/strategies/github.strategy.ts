import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-github2'
import { SocialLoginDto } from '../dto/auth.dto'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: 'Ov23liQ6TB9u52fRQwHY', // GitHub 应用的 Client ID
      clientSecret: '1e75f5dbcc63b7fafb10078ca721ff6067118e85', // GitHub 应用的 Client Secret
      callbackURL: 'http://localhost:3000/auth/github/callback', // GitHub 回调地址
      scope: ['user:email'], // 申请的 GitHub 权限范围
    })
  }

  validate(accessToken: string, refreshToken: string, profile: SocialLoginDto) {
    return {
      provider: 'github',
      providerId: profile.providerId,
      username: profile.name,
      email: profile.email || '',
      avatar: profile.avatar || '',
    }
  }
}
