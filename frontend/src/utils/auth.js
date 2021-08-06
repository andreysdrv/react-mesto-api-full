export const BASE_URL = 'https://api.mesto.sidorov.nomoredomains.monster'

const handleResponse = response => response.ok ? response.json() : Promise.reject(`Ошибка ${response.status}`)

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({password, email})
  })
  .then(handleResponse)
}

export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({password, email})
  })
  .then(handleResponse)
  .then((data) => {
    if (data.token) {
      localStorage.setItem('jwt', data.token)
      return data.token
    }
  })
}

export const getContent = token => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${token}`
    }
  })
  .then(handleResponse)
}