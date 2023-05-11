// inside db/index.js
const { Client } = require('pg');

const client = new Client('postgres://postgres:123@localhost:5432/juicebox_dev');


async function createUser({ username, password }) {
    try {
        // await client.connect();
        const result = await client.query(`
        INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
      `, [username, password]);

        return result;
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    console.log("Calling getAllUsers...");
    const { rows } = await client.query(
        `SELECT id, username FROM users;`);
    console.log("getAllUsers query completed, rows:", rows);

    return rows;
}

module.exports = {
    getAllUsers,
    createUser,
}