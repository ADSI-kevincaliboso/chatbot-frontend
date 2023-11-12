export default function (context) {
  if (!process.client) {
    if (
      context.store.getters.userType !== 'admin' ||
      context.store.getters.userType !== 'moderator'
    ) {
      context.redirect('/chatbot')
    }
  }
}
