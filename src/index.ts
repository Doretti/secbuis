import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import router from './routes'
import { config } from 'dotenv'
import bodyParser from 'body-parser'
config()
import { connect } from './database';

const port: number = +(process.env.PORT || 4000)
const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(router)
app.use((error: Error, request: Request, response: Response, next: NextFunction): void | Response => {  
    if (error) {
        return response.status(400).json({ message: error.message }).end()
    }
    next()
})
app.use('/files', express.static('public'))

app.listen(port, () => {
    try {
        connect()
        console.log('Server has been started on port:', port);
    } catch (error) {
        console.log('Error: ', error);
    }
})