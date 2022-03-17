import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type ReportType = 'PERIOD_SUMMARY_CSV' | 'PERIOD_DETAILED_PDF'
export type ReportStatus = 'PENDING' | 'SUCCESS' | 'FAILURE'

@Entity({ name: 'reports' })
export class Report {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ type: 'varchar' })
  key: string | null

  @Column({ type: 'varchar' })
  type: ReportType

  @Column({ type: 'json' })
  data: any

  @Column({ type: 'varchar' })
  status: ReportStatus = 'PENDING'

  @Column({ type: 'json' })
  error: any

  @CreateDateColumn()
  createdAt: Date
}
