import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import 'express-async-errors'

import { logger } from './middleware'
import { routes } from './routes'
import * as database from '../database/connection'

export const api = express()
api.use(logger)
api.use(helmet())
api.use(cors())
api.use(express.json())
api.use('/', routes)
database.connect()
