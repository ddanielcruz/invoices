import { AfterLoad, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type ReportType = 'PERIOD_SUMMARY_CSV' | 'PERIOD_DETAILED_PDF'

export type ReportStatus = 'PENDING' | 'SUCCESS' | 'FAILURE'

export interface ReportPeriodData {
  startDate: Date
  endDate: Date
}

@Entity({ name: 'reports' })
export class Report {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ type: 'varchar' })
  key: string | null

  @Column({ type: 'varchar' })
  type: ReportType

  @Column({ type: 'json' })
  data: ReportPeriodData

  @Column({ type: 'varchar' })
  status: ReportStatus = 'PENDING'

  @Column({ type: 'json' })
  error: any

  @CreateDateColumn()
  createdAt: Date

  @AfterLoad()
  parseData() {
    if (typeof this.data?.startDate === 'string') {
      this.data.startDate = new Date(this.data.startDate)
    }

    if (typeof this.data?.endDate === 'string') {
      this.data.endDate = new Date(this.data.endDate)
    }
  }
}
