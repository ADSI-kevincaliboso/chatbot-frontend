/* eslint-disable no-lonely-if */
export default function (context) {
  if (process.client) {
    if (!context.store.getters.isAuth) {
      context.redirect('/')
    }
  } else {
    if (!context.store.getters.isAuth) {
      context.redirect('/')
    }
  }
}
