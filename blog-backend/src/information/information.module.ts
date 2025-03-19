import { Module } from '@nestjs/common';
import { InformationService, BgUrlService } from './information.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationController } from './information.controller';
import { Information } from './entities/information.entity'
import { BgUrl } from './entities/bgurl.entity';

@Module({
  // 引入typeorm模块，并指定要使用的实体
  imports: [TypeOrmModule.forFeature([Information, BgUrl])],
  // 指定要使用的控制器
  controllers: [InformationController],
  // 指定要使用的服务
  providers: [InformationService, BgUrlService],
})
export class InformationModule { }
