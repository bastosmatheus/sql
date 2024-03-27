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
}

// criando relacionamento entre produto e categoria
async function createTableProducts() {
  await sql/*sql*/ `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name_product TEXT NOT NULL UNIQUE,
      price_product INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      id_category INTEGER REFERENCES categories(id)
    )
  `;
}

async function createTableCategory() {
  await sql/*sql*/ `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name_category TEXT UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
}

createTableCategory();
createTableProducts();
createTableUsers();

export { sql };
