import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-github2'
import { GithubProfile } from '../dto/auth.dto'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: 'Ov23liQ6TB9u52fRQwHY', // GitHub 应用的 Client ID
      clientSecret: 'b74f18bf0a85056f487e7d89f446b62de5a3d581', // GitHub 应用的 Client Secret
      callbackURL: 'http://localhost:3000/api/auth/github/callback', // GitHub 回调地址
      scope: ['user:email'], // 申请的 GitHub 权限范围
    })
  }

  validate(accessToken: string, refreshToken: string, profile: GithubProfile) {
    return {
      provider: 'github',
      providerId: profile._json.id,
      name: profile._json.login,
      email: profile.emails?.[0]?.value || '',
      avatar: profile._json.avatar_url || '',
    }
  }
}
