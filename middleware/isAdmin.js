export default function (context) {
  if (
    context.store.getters.userType !== 'admin' ||
    context.store.getters.userType !== 'moderator'
  ) {
    context.redirect('/')
  }
}
