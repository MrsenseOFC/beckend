import mysql from 'mysql2';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Crie a conexão com o banco de dados
export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Adicione a porta aqui
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem sucedida ao banco de dados MySQL');
});

// Lidar com erros de conexão
db.on('error', (err) => {
    console.error('Erro na conexão com o banco de dados:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Conexão com o banco de dados foi fechada');
    } else {
        throw err;
    }
});

// Fechar a conexão com o banco de dados ao sair do aplicativo (opcional)
process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.error('Erro ao fechar a conexão com o banco de dados:', err);
        }
        console.log('Conexão com o banco de dados fechada');
        process.exit();
    });
});

// Exportar a conexão para ser utilizada em outros módulos
export default db;
