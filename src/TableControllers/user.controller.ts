import isEmail from "validator/lib/isEmail"
import database from '../database'
import sha256 from 'crypto-js/sha256';
import Main from "./main.controller";
import { Query } from "mysql";

/**
 * Abstract class for manage users
 */
export default abstract class User extends Main {
    /**
     * Create new user
     * @param data Object with fields: name, password, email
     * @param __result Handler for get result
     * @returns Query
     */
    public static create(data: ICreateUserObjectType, __result: Function = () => {}): Query {
        if ((data?.name?.length <= 3 || data?.name?.length >= 12) || !data?.name) {
            throw new Error('Name isn\'t valid')
        }

        if (!isEmail(data?.email)) {
            throw new Error('Email isn\'t valid')
        }

        if (data?.password?.length <= 3 || data?.password?.length >= 12) {
            throw new Error('Password isn\'t valid')
        }

        const encripted_password = sha256(data.password).toString()

        return database.query(`INSERT INTO users SET ?`, {
            ...data,
            password: encripted_password
        }, User.result_hendler(__result))
    }

    /**
     * Get user by id
     * @param id Id for get user by this id
     * @param __result Handler for get result
     * @returns Query
     */
    public static findById(id: number, __result: Function = () => {}): Query {
        if (!id) {
            throw new Error('Identificator isn\'t valid')
        }

        return database.query(`SELECT id, name, email, lastname, sex, created_at, updated_at FROM users WHERE id = ?`, id, User.result_hendler(__result))
    }

    /**
     * Get users by filter
     * @param where Object for filtering result
     * @param limit Number of users received
     * @param page Current users page
     * @param __result Handler for get result
     * @returns Query
     */
    public static findBy(where: IFilterObjectType, limit: number = 10, page: any = 1, __result: Function = () => {}): Query {
        let query: string = `SELECT id, name, email, lastname, sex, created_at, updated_at FROM users `
        const filterArray: string[] = []
        for (const key of Object.keys(where)) {
            filterArray.push(` ${key} = '${where[key]}'`)
        }
        if (filterArray.length >= 1) {
            query += ' WHERE'
        }
        query += filterArray.join(' AND')
        query += `ORDER BY created_at DESC`
        query += `\nLIMIT ${limit} `
        query += `OFFSET ${(page - 1) * 10};`
        
        return database.query(query, User.result_hendler(__result))
    }

    /**
     * Update user by id
     * @param data Object for update user
     * @param __result Handler for get result
     * @returns Query
     */
    public static updateById(id: number, data: IUpdateObjectType, __result: Function = () => {}): Query {
        if (data.name && (data.name.length <= 3 || data.name.length >= 12)) {
            throw new Error('Name isn\'t valid')
        }
        if (data.email && !isEmail(data.email)) {
            throw new Error('Email isn\'t valid')
        }
        return database.query(`UPDATE users SET ? WHERE id = ${id}`, data, User.result_hendler(__result))
    }

    /**
     * Delete user by id
     * @param id Id for delete user
     * @param __result Handler for get result
     * @returns Query
     */
    public static deleteById(id: number, __result: Function = () => {}): Query {
        return database.query(`DELETE FROM users WHERE id = ?`, id, User.result_hendler(__result))
    }
}

/**
 * User Filtering Interface 
 */
interface IFilterObjectType {
    [key: string]: number | string
}

/**
 * User Update Interface
 */
interface IUpdateObjectType {
    id: number
    password?: undefined | null
    created_at?: undefined | null
    updated_at?: undefined | null
    name?: string
    email?: string
    avatarId?: number
}

/**
 * User Create Interface
 */
export interface ICreateUserObjectType {
    name: string
    email: string
    password: string
}