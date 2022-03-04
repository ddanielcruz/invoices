import 'dotenv/config'
import 'reflect-metadata'

import { Worker } from 'bullmq'

import { logger } from '../config/logger'
import { config } from '../config/queue'
import * as database from '../database/connection'
import '../config/container'

async function execute() {
  // Start database connection
  await database.connect()

  // Import jobs locally to avoid problem with injecting the jobs
  const { jobs } = await import('./jobs')

  // Create a new worker to process the queue
  return new Worker(
    config.name,
    async job => {
      try {
        logger.debug(`Processing job "${job.name}"`)
        if (!jobs[job.name]) {
          throw new Error(`Job with key "${job.name}" not found.`)
        }

        return await jobs[job.name].execute(job.data)
      } catch (error: any) {
        logger.error(error?.stack ?? error)
      }
    },
    config
  )
}

execute()
