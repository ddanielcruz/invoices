import { Router } from 'express'

import { routes as invoices } from './invoices-routes'
import { routes as reports } from './reports-routes'

// TODO: Add security
export const routes = Router()
routes.use('/invoices', invoices)
routes.use('/reports', reports)
