const express = require('express')
const bodyParser = express.json()
const authRouter = express.Router()
const authService = require('./auth-service')

authRouter
  .post('/', bodyParser, (req, res, next) => {
    const { name, password } = req.body
    const loginUser = { name, password }

    for (const [key, value] of Object.entries(loginUser)){
        if(value == null){
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
        }
    }

    authService.getAdminWithName(req.app.get('db'), loginUser.name)
        .then(user => {
            if(!user){
                return res.status(400).json({
                    error: 'Incorrect user_name or password'
                })
            }

        return authService.comparePasswords(loginUser.password, user.password)
        .then(compareMatch => {
            if(!compareMatch){
                return res.status(400).json({
                    error: 'Incorrect user_name or password'
                })
            }
            const sub = user.name 
            const payload = { user_id: user.id }
            res.send({
                authToken: authService.createJWT(sub, payload) //why are we sending a jwt as a response
            })
        })
    })
    .catch(next)
  })

module.exports = authRouter
