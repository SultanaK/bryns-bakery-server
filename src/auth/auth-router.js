const express = require('express')
const bodyParser = express.json()
const authRouter = express.Router()
const authService = require('./auth-service')

authRouter
  .post('/login', bodyParser, (req, res, next) => {
    const { username, password } = req.body
    const loginUser = { username, password }

    for (const [key, value] of Object.entries(loginUser)){
        if(value == null){
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
        }
    }

    authService.compareAdminUserName(req.app.get('db'), loginUser.username)
        .then(user => {
            if(!user){
                return res.status(400).json({
                    error: 'Incorrect user_name or password'
                })
            }
        return authService.comparePasswords(loginUser.password, dbUser.password)
        .then(compareMatch => {
            if(!compareMatch){
                return res.status(400).json({
                    error: 'Incorrect user_name or password'
                })
            }
            const sub = dbUser.user_name 
            const payload = { user_id: dbUser.id }
            res.send({
                authToken: authService.createJWT(sub, payload) //why are we sending a jwt as a response
            })
        })
    })
    .catch(next)
  })

module.exports = authRouter
