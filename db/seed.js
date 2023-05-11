// inside db/seed.js

// grab our client with destructuring from the export in index.js
// const { getAllUsers, createUser } = require('./index');
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












async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUser({ id: 1, username: 'albert', password: 'bertie99' });
        const sandra = await createUser({ id: 2, username: 'sandra', password: '2sandy4me' });
        const glamgal = await createUser({ id: 3, username: 'glamgal', password: 'soglam' });


        console.log(albert);

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}

async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
        DROP TABLE IF EXISTS users;
      `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL
        );
      `);

        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error testing database!");
        throw error;
    }
}


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
