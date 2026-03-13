import express from 'express'
import { login, register } from '../controllers/auth.controllers'

const authRotuer = express.Router()

authRotuer.post('/register', register)
authRotuer.post('/login', login)

export default authRotuer
