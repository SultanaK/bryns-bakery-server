const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let basicToken
  if (!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: 'Missing basic token' })
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length)
  }

  const [tokenUserName, tokenPassword] = AuthService.parseBasicToken(basicToken)

  console.log(tokenUserName)
  if (!tokenUserName || !tokenPassword) {
    return res.status(401).json({ error: 'Unauthorized request 1' })
  }

  AuthService.getAdminWithName(
    req.app.get('db'),
    tokenUserName
  )
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized request 2' })
      }

      return AuthService.comparePasswords(tokenPassword, user.password)
        .then(passwordsMatch => {
          if (!passwordsMatch) {
            console.log('error 4')

            return res.status(401).json({ error: 'Unauthorized request 3' })
          }

          next()
        })
    })
    .catch(next)
}

module.exports = {
  requireAuth,
}