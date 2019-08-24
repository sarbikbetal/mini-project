const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
})

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }
    client.query("CREATE TABLE IF NOT EXISTS agencies (licence VARCHAR(15) NOT NULL PRIMARY KEY,name VARCHAR(120) NOT NULL, address TEXT NOT NULL, contact INT NOT NULL, apikey VARCHAR(64)", (err, result) => {
        release()
        if (err) {
            return console.error('Error executing query', err.stack)
        }
        console.log(result.rows)
    })
})

function adduser(params, callback) {
    return pool.query("INSERT INTO agencies (licence,name,address,contact,apikey) VALUES($1,$2,$3,$4,$5)", params, callback);
}

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
    addUser: adduser
}