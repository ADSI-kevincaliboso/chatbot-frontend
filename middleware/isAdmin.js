/* eslint-disable no-lonely-if */
export default function (context) {
  if (!process.client) {
    if (context.store.getters.userType !== 'admin') {
      context.redirect('/chatbot')
    }
  } else {
    if (context.store.getters.userType !== 'admin') {
      context.redirect('/chatbot')
    }
  }
}
