import mysql from 'mysql2';
let con = null
//Config Mysql
import * as dotenv from 'dotenv'
dotenv.config({path : '../.env'})

async function Create_connect()
{
    const mysqlConfig= {
        host: process.env.MYSQL_HOST, //dockerfile "mysql_server"
        // port: "3306",
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }
    con = mysql.createConnection(mysqlConfig)
    con.connect(function(err){
        if(err) throw err;
        else console.log('Connect Database Successfully');
    })
}
export {
    Create_connect,
    con
}