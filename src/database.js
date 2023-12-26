import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'flight_management',
    password: 'Dahnen123!',
    connectionLimit: 10,
});

export default pool;
