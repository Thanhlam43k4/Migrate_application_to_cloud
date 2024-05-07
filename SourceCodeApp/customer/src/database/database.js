import mysql from 'mysql2';
let con = null
//Config Mysql


async function Create_connect()
{
    const mysqlConfig= {
        host: "mysql_server", //dockerfile "mysql_server"
        // port: "3306",
        user: "root",
        password:"root",
        database:"customer_db"
    }
    con = mysql.createConnection(mysqlConfig)
    con.connect(function(err){
        if(err) throw err;
        else console.log('Connected to Database');
    })
}
export {
    Create_connect,
    con
}