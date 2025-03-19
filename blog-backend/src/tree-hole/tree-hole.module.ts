import { Module } from '@nestjs/common';
import { TreeHoleService } from './tree-hole.service';
import { TreeHoleController } from './tree-hole.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeHole } from './entities/tree-hole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TreeHole])],
  controllers: [TreeHoleController],
  providers: [TreeHoleService],
})
export class TreeHoleModule { }
