import { Router } from 'express'

import * as controller from '../controllers/reports-controller'

export const routes = Router()
routes.post('/', controller.create)
