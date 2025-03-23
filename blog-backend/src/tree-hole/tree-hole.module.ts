import { Module } from '@nestjs/common';
import { TreeHoleService } from './tree-hole.service';
import { TreeHoleController } from './tree-hole.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeHole } from './entities/tree-hole.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TreeHole]), AuthModule],
  controllers: [TreeHoleController],
  providers: [TreeHoleService],
})
export class TreeHoleModule { }
