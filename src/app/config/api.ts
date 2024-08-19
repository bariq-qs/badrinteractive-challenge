import axios, { AxiosError, AxiosResponse } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URI_BASE
const axl = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: '*/*',
  },
})

axl.interceptors.request.use((config: any) => config, (error: AxiosError) => Promise.reject(error))
axl.interceptors.response.use(async (response: AxiosResponse) => response, async (err: AxiosError) => Promise.reject(err))

export default axl
