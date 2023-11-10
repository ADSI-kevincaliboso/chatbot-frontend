export default function (context) {
  const userType = context.store.getters.userType
  const isAuth = context.store.getters.isAuth

  // console.log(isAuth)

  if (isAuth && userType === 'user') {
    context.redirect('/chatbot')
  } else if (isAuth && userType === 'admin') {
    context.redirect('/admin')
  }
}
