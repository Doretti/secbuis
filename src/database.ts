import mysql from 'mysql'
import { config } from 'dotenv'
config()

const base = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    port: 3306
})

export const connect = (): void => {
    
    base.connect((err: mysql.MysqlError): void => {
        if (err) throw err
        base.query(`
            CREATE TABLE IF NOT EXISTS \`files\` (
                id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                name varchar(255) NOT NULL
            );
        `)
        base.query(`
            CREATE TABLE IF NOT EXISTS \`users\` (
                id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                name varchar(255) NOT NULL,
                lastname varchar(255),
                email varchar(255),
                password varchar(255) NOT NULL,
                sex ENUM('male', 'female'),
                avatarId int(11) UNIQUE,
                FOREIGN KEY (avatarId) REFERENCES files(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `)
        console.log("Successfully connected to the database.");
    })
}

export default base