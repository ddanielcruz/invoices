import { BaseJob } from './base-job'

interface JobMapping {
  [key: string]: BaseJob
}

export const jobs: JobMapping = {}
