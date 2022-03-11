import { Router } from 'express'

import * as invoices from '../controllers/invoices-controller'

export const routes = Router()
routes.post('/', invoices.create)
