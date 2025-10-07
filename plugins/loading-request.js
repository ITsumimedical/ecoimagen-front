export default ({ store, $axios }, inject) => {
    const makeSafe = function (controller, fn) {
      return function () {
        try {
          return fn.apply(controller, arguments)
        } catch (error) {
          throw error
        }
      }
    }

    const executeSafe = function (controller, fn) {
      return new Promise(async (resolve, reject) => {
        store.commit('setLoading', true)
        try {
          const fnSafe = makeSafe(controller, fn)
          const result = await fnSafe()
          resolve(result)
        } catch (error) {
          reject(error)
        }
        store.commit('setLoading', false)
      })
    }

    // este metodo es para consultar
    inject('loadingGetRequest', async (url) =>
      executeSafe(this, () => {
        return $axios.get(url)
      })
    )

    // este metodo es para guardar
    inject('loadingPostRequest', async (url, data = {}) =>
      executeSafe(this, () => {
        return $axios.post(url, data)
      })
    )

    // este metodo es para actualizar
    inject('loadingPutRequest', async (url, data = {}) =>
      executeSafe(this, () => {
        return $axios.put(url, data)
      })
    )
  }