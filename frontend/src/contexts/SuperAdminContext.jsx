import { createContext } from 'react'

/**
 * Session state of the Super Admin area.
 *
 * The user is always the record returned by the Laravel API, the browser
 * never stores a role or an authorisation flag of its own.
 */
export const SuperAdminContext = createContext(null)
