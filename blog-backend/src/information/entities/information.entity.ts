import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('website_information')
export class WebsiteInformation {
  @PrimaryGeneratedColumn()
  id: number; // 网站信息ID，自动递增主键

  @Column({ length: 100 })
  websiteName: string; // 网站名称

  @Column({ type: "text" })
  headerNotification: string; // 头部通知

  @Column({ type: "text" })
  sidebarAnnouncement: string; // 侧边栏公告

  @Column({ length: 50 })
  recordInfo: string; // 备案号

  @Column({ type: 'timestamp' })
  startTime: Date; // 站点启动时间

  @Column({ type: 'timestamp' })
  lastUpdateTime: Date; // 最近更新时间

  @Column({ type: 'int', default: 0 })
  articleCount: number; // 文章数量

  @Column({ type: 'int', default: 0 })
  wordCount: number; // 文章总字数

  @Column({ type: 'int', default: 0 })
  visitCount: number; // 访问次数

  @Column({ length: 50, default: '0' })
  runTime: string; // 运行时间
}
