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
      userId: 0,
      doneWithChatbot: 0,
      botInit: true,
    },
    mutations: {
      setUserToken(state, token) {
        state.authToken = token
      },
      setChatbotStatus(state, status) {
        state.doneWithChatbot = status
      },
      setBotInit(state, status) {
        state.botInit = status
      },
      setUserId(state, id) {
        state.userId = id
      },
      clearStore(state) {
        state.authToken = ''
        state.error = ''
        state.chatroom = null
        state.chatMessages = []
        state.userType = ''
        state.userId = 0
        state.doneWithChatbot = 0
        state.botInit = false

        Cookie.remove('jwt')
        Cookie.remove('messages')
        Cookie.remove('chatroomId')
        Cookie.remove('userType')
        Cookie.remove('userId')
        Cookie.remove('doneWithChatbot')
        Cookie.remove('botInit')
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
                vuexContext.commit('setUserId', user.data.id)
                vuexContext.commit(
                  'setChatbotStatus',
                  user.data.doneWithChatbot
                )
                vuexContext.commit(
                  'setBotInit',
                  Boolean(user.data.doneWithChatbot)
                )
                // set to cookie using js-cookie
                Cookie.set('jwt', user.token, {
                  sameSite: 'strict',
                })
                Cookie.set('chatroomId', user.chatroomId)
                Cookie.set('userType', user.data.user_type)
                Cookie.set('userId', user.data.id)
                Cookie.set('doneWithChatbot', user.data.doneWithChatbot)
                Cookie.set('botInit', Boolean(user.data.doneWithChatbot))

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
          // login part
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
                vuexContext.commit('setUserId', user.data.id)

                Cookie.set('jwt', user.token, { sameSite: 'strict' })
                Cookie.set('chatroomId', user.chatroomId)
                Cookie.set('userType', user.data.user_type)
                Cookie.set('userId', user.data.id)

                if (user.data.user_type === 'user') {
                  vuexContext.commit(
                    'setChatbotStatus',
                    user.data.doneWithChatbot
                  )
                  vuexContext.commit('setBotInit', user.data.doneWithChatbot)

                  Cookie.set('doneWithChatbot', user.data.doneWithChatbot)
                  Cookie.set('botInit', Boolean(user.data.doneWithChatbot))
                }

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

          const userId = req.headers.cookie
            .split(';')
            .find((value) => value.trim().startsWith('userId='))
            .split('=')[1]

          if (type === 'user') {
            const doneWithChatbot = req.headers.cookie
              .split(';')
              .find((value) => value.trim().startsWith('doneWithChatbot='))
              .split('=')[1]

            const botInit = req.headers.cookie
              .split(';')
              .find((value) => value.trim().startsWith('botInit='))
              .split('=')[1]

            vuexContext.commit('setChatbotStatus', doneWithChatbot)
            vuexContext.commit('setBotInit', botInit)
          }

          vuexContext.commit('setUserToken', token)
          vuexContext.commit('setChatRoom', chatroomId)
          vuexContext.commit('setUserType', type)
          vuexContext.commit('setUserId', userId)
        }
      },

      async logoutUser(vuexContext) {
        // logout user from backend
        // const roomId = vuexContext.state.chatroom
        await axios.post(`${process.env.baseUrl}/logout`, null, {
          headers: {
            Authorization: `Bearer ${this.state.authToken}`,
          },
        })
        // clear cookies also
        vuexContext.commit('clearStore')
        // this.$echo.leave(`chat.${roomId}`)
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

      takeOverChat(vuexContext, id) {
        vuexContext.commit('setChatRoom', id)
        Cookie.set('chatroomId', id)
      },

      setChatbotDone(vuexContext, status) {
        vuexContext.commit('setChatbotStatus', status)
        vuexContext.commit('setBotInit', status)
        Cookie.set('doneWithChatbot', 1)
        Cookie.set('botInit', true)
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
      userId(state) {
        return state.userId
      },
      chatbotDone(state) {
        return state.doneWithChatbot
      },
      chatbotInit(state) {
        return state.botInit
      },
    },
  })
}

export default createStore
