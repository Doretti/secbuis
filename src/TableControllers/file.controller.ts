import { Query } from 'mysql'
import database from '../database'
import Main from './main.controller'

/**
 * Abstract class for manage files
 */
export default class File extends Main {
    /**
     * Create new file
     * @param data Object with fields: name
     * @param __result Handler for get result
     * @returns Query
     */
    public static create(data: ICreateFileObjectType, __result: Function = () => {}): Query {
        return database.query(`INSERT INTO files SET ?`, data, File.result_hendler(__result))
    }

    /**
     * Delete file by id
     * @param id Id for delete file
     * @param __result Handler for get result
     * @returns Query
     */
     public static deleteById(id: number, __result: Function = () => {}): Query {
        return database.query(`DELETE FROM files WHERE id = ?`, id, File.result_hendler(__result))
    }
}

/**
 * File Create Interface
 */
interface ICreateFileObjectType {
    name: string
}