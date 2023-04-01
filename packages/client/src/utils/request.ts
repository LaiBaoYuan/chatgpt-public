import axios, { type AxiosRequestConfig } from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  withCredentials: true
})

http.interceptors.response.use(
  (res) => {
    const { status, data, config } = res
    if (status === 200) {
      if(__DEV__) {
        console.log('接口' + config.url + '请求成功。请求返回值为', data)
      }
      return Promise.resolve(data)
    } else {
      return Promise.reject()
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const AxiosGet = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return http.get<T, T>(url, config)
}

export const AxiosPost = <T = any, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => {
  return http.post<T, T, D>(url, data, config)
}

export const AxiosPut = <T = any, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => {
  return http.put<T, T, D>(url, data, config)
}

export const AxiosDelete = <T = any>(
  url: string,
  config?: AxiosRequestConfig
) => {
  return http.delete<T, T>(url, config)
}
