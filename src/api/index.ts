import 'dotenv/config'
import 'reflect-metadata'

import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import 'express-async-errors'

import * as database from '../database/connection'
import { logger, errorHandler } from './middleware'
import { routes } from './routes'
import '../config/container'

export const api = express()
api.use(logger)
api.use(helmet())
api.use(cors())
api.use(express.json())
api.use('/', routes)
api.use(errorHandler)
database.connect()
