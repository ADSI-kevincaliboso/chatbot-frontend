import { Store } from 'vuex'
import Cookie from 'js-cookie'
import axios from 'axios'

const createStore = () => {
  return new Store({
    state: {
      authToken: '',
      error: '',
    },
    mutations: {
      setUserToken(state, token) {
        state.authToken = token
      },
      clearToken(state) {
        state.authToken = ''
      },
      setError(state, error) {
        state.error = error
      },
    },
    actions: {
      async authUser(vuexContext, authData) {
        const data = {
          name: authData.name,
          email: authData.email,
          password: authData.password,
        }

        const isLogin = authData.isLogin

        if (!isLogin) {
          // register
          try {
            return await axios
              .post(`${process.env.baseUrl}/register`, data, {
                headers: {
                  Accept: 'application/json',
                },
              })
              .then((res) => {
                const user = res.data
                vuexContext.commit('setUserToken', user.token)
                // set to cookie using js-cookie
                Cookie.set('jwt', user.token)

                // return user type for routing purposes outside
                return user.data.user_type
              })
              // eslint-disable-next-line unicorn/error-message
              .catch((error) => {
                vuexContext.commit('setError', error.response.data.message)
              })
          } catch (error) {
            // console.log(error)
          }
        } else {
          try {
            return await axios
              .post(`${process.env.baseUrl}/login`, data, {
                headers: {
                  Accept: 'application/json',
                },
              })
              .then((res) => {
                const user = res.data
                vuexContext.commit('setUserToken', user.token)

                Cookie.set('jwt', user.token)

                return user.data.user_type
              })
              // eslint-disable-next-line unicorn/error-message
              .catch((error) => {
                vuexContext.commit('setError', error.response.data.message)
              })
          } catch (error) {
            //
          }
        }
      },
      // call this everytime we refresh the page (on the middleware)
      initAuth(vuexContext) {
        const token = Cookie.get('jwt')

        if (token) {
          vuexContext.commit('setUserToken', token)
        }
      },

      async logoutUser(vuexContext) {
        // logout user from backend
        await axios.post(`${process.env.baseUrl}/logout`, null, {
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
          },
        })
        // clear cookies also
        vuexContext.commit('clearToken')
        Cookie.remove('jwt')
      },
    },
    getters: {
      isAuth(state) {
        return state.authToken !== ''
      },
      error(state) {
        return state.error
      },
    },
  })
}

export default createStore
