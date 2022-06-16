import { MysqlError, queryCallback } from "mysql"


/**
 * Abstract class for inheriting basic functions
 */
export default abstract class Main {
    /**
     * Function for query handling
     * @param _result Handler for get result
     * @returns Function for mysql query (queryCallback)
     */
     protected static result_hendler(_result: Function): queryCallback {
        return function(err: MysqlError | null, result: any): void {
            if (err) throw err
            _result(result)
        }
    }
}