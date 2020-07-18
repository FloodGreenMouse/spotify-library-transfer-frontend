import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default () => {
  const client = axios.create({
    baseURL: 'http://127.0.0.1:8888'
  })
  client.interceptors.response.use(res => {
    if (res.status === 200 || res.status === 201) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  }, err => {
    if (err.response.status) {
      if (err.response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token') || null
        if (refreshToken) {
          client.get('/refresh')
            .then(res => {
              console.log('RES', res)
            }).catch(err => {
              return Promise.reject(err)
            })
        }
      }
      return Promise.reject(err)
    }
  })
  return client
}
