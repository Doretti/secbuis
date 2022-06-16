import express, { Request, Response, Router } from 'express'
import userController from '../TableControllers/user.controller'

const router: Router = express.Router()

router.get('/profile/:id', (request: Request, response: Response): any => {
    const id: number = +request.params.id
    userController.findById(id, (res: any) => {
        response.json(res[0]).end()
    })
})

router.put('/profile/:id', (request: Request, response: Response): any => {
    const id: number = +request.params.id
    userController.updateById(id, request.body, (res: any) => {
        response.json(res[0]).end()
    })
})

router.get('/profiles', (request: Request, response: Response): any => {    
    userController.findBy({}, 10, request?.query?.page || 1, (res: any) => {
        response.json(res).end()
    })
})

export default router