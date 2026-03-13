import express from 'express'
import dotenv from 'dotenv'
import authRotuer from './routes/auth.router'

dotenv.config()
const app = express()

app.use(express.json())

const PORT = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', authRotuer)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
