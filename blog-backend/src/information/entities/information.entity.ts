import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('website_information')
export class WebsiteInformation {
  @PrimaryGeneratedColumn()
  id: number; // 网站信息ID，自动递增主键

  @Column({ length: 100 })
  websiteName: string; // 网站名称

  @Column({ length: 255 })
  headerNotification: string; // 头部通知

  @Column({ length: 255 })
  sidebarAnnouncement: string; // 侧边栏公告

  @Column({ length: 50 })
  recordInfo: string; // 备案号

  @Column({ type: 'timestamp' })
  startTime: Date; // 站点启动时间

  @Column({ type: 'timestamp' })
  lastUpdateTime: Date; // 最近更新时间

  @Column({ type: 'int' })
  articleCount: number; // 文章数量

  @Column({ type: 'int' })
  wordCount: number; // 文章总字数

  @Column({ type: 'int' })
  visitCount: number; // 访问次数

  @Column({ length: 50 })
  runTime: string; // 运行时间
}
