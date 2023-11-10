/* eslint-disable no-useless-return */
import { Store } from 'vuex'
import Cookie from 'js-cookie'
import axios from 'axios'

const createStore = () => {
  return new Store({
    state: {
      authToken: '',
      error: '',
      chatroom: null,
      chatMessages: [],
      userType: '',
    },
    mutations: {
      setUserToken(state, token) {
        state.authToken = token
      },
      clearStore(state) {
        state.authToken = ''
        state.error = ''
        state.chatroom = null
        state.chatMessages = []
        state.userType = ''

        Cookie.remove('jwt')
        Cookie.remove('messages')
        Cookie.remove('chatroomId')
        Cookie.remove('userType')
      },
      setError(state, error) {
        state.error = error
      },
      setChatRoom(state, id) {
        state.chatroom = id
      },
      setMessages(state, messages) {
        state.chatMessages = []
        messages.forEach((message) => {
          state.chatMessages.push(message)
        })
      },
      setUserType(state, type) {
        state.userType = type
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
                vuexContext.commit('setChatRoom', user.chatroomId)
                vuexContext.commit('setUserType', user.data.user_type)
                // set to cookie using js-cookie
                Cookie.set('jwt', user.token)
                Cookie.set('chatroomId', user.chatroomId)
                Cookie.set('userType', user.data.user_type)

                // return user type for routing purposes outside
                return user.data.user_type
              })
              // eslint-disable-next-line unicorn/error-message
              .catch((error) => {
                vuexContext.commit('setError', error.response.data.message)
              })
          } catch (error) {
            //
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
                vuexContext.commit('setChatRoom', user.chatroomId)
                vuexContext.commit('setUserType', user.data.user_type)

                Cookie.set('jwt', user.token)
                Cookie.set('chatroomId', user.chatroomId)
                Cookie.set('userType', user.data.user_type)

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
      initAuth(vuexContext, req) {
        if (req) {
          if (!req.headers.cookie) {
            return
          }

          const token = req.headers.cookie
            .split(';')
            .find((value) => value.trim().startsWith('jwt='))
            .split('=')[1]

          const chatroomId = req.headers.cookie
            .split(';')
            .find((value) => value.trim().startsWith('chatroomId='))
            .split('=')[1]

          const type = req.headers.cookie
            .split(';')
            .find((value) => value.trim().startsWith('userType='))
            .split('=')[1]
          vuexContext.commit('setUserToken', token)
          vuexContext.commit('setChatRoom', chatroomId)
          vuexContext.commit('setUserType', type)
        }
      },

      async logoutUser(vuexContext) {
        // logout user from backend
        const roomId = vuexContext.state.chatroom
        await axios.post(`${process.env.baseUrl}/logout`, null, {
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
          },
        })
        // clear cookies also
        vuexContext.commit('clearStore')

        this.$echo.leave(`chat.${roomId}`)
      },

      async createChatRoom(vuexContext) {
        await axios
          .post(`${process.env.baseUrl}/chat-rooms`, null, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${this.state.authToken}`,
            },
          })
          .then((res) => {
            vuexContext.commit('setChatRoom', res.data.id)
          })
      },

      saveMessages(vuexContext, messages) {
        vuexContext.commit('setMessages', messages)
      },

      addMessage(vuexContext, message) {
        vuexContext.state.chatMessages.push(message)
      },
    },
    getters: {
      isAuth(state) {
        return state.authToken !== ''
      },
      error(state) {
        return state.error
      },
      chatroom(state) {
        return state.chatroom
      },
      token(state) {
        return state.authToken
      },
      messages(state) {
        return state.chatMessages
      },
      userType(state) {
        return state.userType
      },
    },
  })
}

export default createStore
