import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('search_records')
export class SearchRecords {
  @PrimaryColumn()
  id: number

  // 用户名
  @Column()
  userName: string

  // 搜索内容
  @Column()
  content: string
}