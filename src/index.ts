import postgres from "postgres";

const sql = postgres("postgres://postgres:root@localhost:5432/sql", {
  transform: postgres.fromCamel,
});

async function createTableUsers() {
  await sql/*sql*/ `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    nickname TEXT NOT NULL UNIQUE, 
    user_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

  console.log("conexão fechada");
}

createTableUsers();

export { sql };
