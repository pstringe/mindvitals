import axios, { AxiosRequestConfig } from 'axios'
import config from '../utils/config'

const axiosCall = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
})

export function useApiFetch() {
  return async function apiFetch(path: string, opts?: AxiosRequestConfig) {
    if (path && path.length && path[0] !== '/') {
      path = `/${path}`
    }

    return axiosCall(`${path}`, opts)
  }
}
