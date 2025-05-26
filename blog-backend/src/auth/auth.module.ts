// src/auth/auth.module.ts
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { User } from 'src/users/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import jwtConfig from '../../jwt.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { HashingService } from './hashing.service';
import { GiteeStrategy } from './strategies/gitee.strategy'
import { GithubStrategy } from './strategies/github.strategy'
import { MailModule } from '../mail/mail.module';  // 导入 MailModule
import { AuthGuard } from './auth.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MailModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get<number>('jwt.accessTokenTtl')}s`,
        },
      }),

      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashingService,
    GiteeStrategy,
    GithubStrategy,
    AuthGuard,
    GiteeStrategy
  ],
  exports: [JwtModule],
})
export class AuthModule { }
