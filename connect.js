import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Crie o pool de conexões com o banco de dados
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Adicione a porta aqui
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexões simultâneas
    queueLimit: 0 // Número máximo de conexões na fila
});

// Testar a conexão ao banco de dados
async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('Conexão bem sucedida ao banco de dados MySQL. Resultado da consulta:', rows[0].solution);
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

testConnection();

// Exportar o pool de conexões para ser utilizado em outros módulos
export default pool;
