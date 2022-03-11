import { Router } from 'express'

import { routes as invoices } from './invoices-routes'

// TODO: Add security
export const routes = Router()
routes.use('/invoices', invoices)
