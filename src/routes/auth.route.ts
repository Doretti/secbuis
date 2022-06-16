import express, { Request, Response, Router } from 'express'
import userController, { ICreateUserObjectType } from '../TableControllers/user.controller'
import sha256 from 'crypto-js/sha256';
import jwt, { Secret } from 'jsonwebtoken'

const router: Router = express.Router()

interface ILoginUserObjectType {
    email: string
    password: string
}

router.post('/user/register', (request: Request, response: Response): any => {

    const body: ICreateUserObjectType = request.body

    const user = userController.create(body).values

    return response.status(200).json(user).end()
})

router.post('/user/login', (request: Request, response: Response): any => {

    const body: ILoginUserObjectType = request.body
    userController.findBy({
        email: body.email,
        password: sha256(body.password).toString()
    }, 10, 1, (res: any) => {
        if (!res) {
            throw new Error('User not found')
        }
        const token = jwt.sign({
            ...res[0],
            exp: Math.floor(Date.now() / 1000) + 600
        }, process.env.JWT_SECRET as Secret)

        response.send(token).end()
    })
})

export default router