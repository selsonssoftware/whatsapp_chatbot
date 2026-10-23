import { apiRequest } from './api.js'

const STORE_ADMINS_ENDPOINT = 'https://whatsapp.selsons.com/api/store_admins'
const LOGIN_ADMIN_ENDPOINT = 'https://whatsapp.selsons.com/api/login_admin'
const STORE_SUPPORTERS_ENDPOINT = 'https://whatsapp.selsons.com/api/store_supporters'

export function registerAdminWithApi({ name, email, phone, password }) {
  return apiRequest(STORE_ADMINS_ENDPOINT, {
    allowInSimulation: true,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      status: 1,
    }),
  })
}

export function loginAdminWithApi({ login, password }) {
  return apiRequest(LOGIN_ADMIN_ENDPOINT, {
    allowInSimulation: true,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: String(login || '').trim(),
      password,
    }),
  })
}

export function createSupporterWithApi({
  adminId,
  name,
  email,
  phone,
  password,
  languages,
  status = 1,
}) {
  return apiRequest(STORE_SUPPORTERS_ENDPOINT, {
    allowInSimulation: true,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      admin_id: String(adminId || '').trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      status,
      languages: Array.isArray(languages) ? languages : [],
    }),
  })
}
