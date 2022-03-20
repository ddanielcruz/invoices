import { Router } from 'express'

import * as invoices from '../controllers/invoices-controller'

export const routes = Router()
routes.get('/', invoices.listByPeriod)
routes.post('/', invoices.create)
