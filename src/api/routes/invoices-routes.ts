import { Router } from 'express'

import * as controller from '../controllers/invoices-controller'

export const routes = Router()
routes.get('/', controller.listByPeriod)
routes.post('/', controller.create)
