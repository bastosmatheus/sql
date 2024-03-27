import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sql } from "./index";

const app = express();

const jsonBodyParser = bodyParser.json();
const urlEncoded = bodyParser.urlencoded({ extended: true });

app.use(cors());
app.use(urlEncoded);
app.use(jsonBodyParser);

app.get("/users", async (req: Request, res: Response) => {
  // pegando todos os usuários registrados, ordenando pelo ID (decrescente)
  const users = await sql/*sql*/ `
    SELECT * FROM users
    ORDER BY id DESC
  `;

  return res.status(200).json({ users });
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // pegando apenas um usário e selecionando os campos de id, nickname e password. Filtrando pelo ID.
  const user = await sql/* sql */ `
    SELECT id, nickname, user_password FROM users
    WHERE id = ${id}
  `;

  return res.status(200).json({ user });
});

app.post("/users", async (req: Request, res: Response) => {
  const { nickname, user_password } = req.body;

  // criando um usuário, passando os valores nickname e password
  const user = await sql/*sql*/ `
    INSERT INTO users (nickname, user_password)
    VALUES (${nickname}, ${user_password})

    RETURNING *
  `;

  return res.status(200).json({ user });
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nickname, user_password } = req.body;

  // atualizando um usuário, passando o novo nickname e novo password. Fazendo a busca pelo ID.
  const user = await sql/* sql */ `
    UPDATE users SET "nickname" = ${nickname}, "user_password" = ${user_password}
    WHERE users.id = ${id}

    RETURNING *
  `;

  return res.status(200).json({ user });
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // deletando um usuário com o ID informado.
  const user = await sql/* sql */ `
    DELETE FROM users 
    WHERE id = ${id}

    RETURNING *
  `;

  return res.status(200).json({ user });
});

app.post("/categories", async (req: Request, res: Response) => {
  const { name_category } = req.body;

  // criando uma categoria, passando o nome
  const category = await sql/*sql*/ `
    INSERT INTO categories (name_category)
    VALUES (${name_category})

    RETURNING *
  `;

  return res.status(200).json({ category });
});

app.post("/products", async (req: Request, res: Response) => {
  const { name_product, price_product, id_category } = req.body;

  // criando um produto, passando nome, preço e id da categoria
  const product = await sql/*sql*/ `
    INSERT INTO products (name_product, price_product, id_category)
    VALUES (${name_product}, ${price_product}, ${id_category})

    RETURNING *
  `;

  return res.status(200).json({ product });
});

app.get("/products", async (req: Request, res: Response) => {
  // selecionando as colunas de nome do produto, preço do produto e pegando na tabela categories o nome da categoria correspondente ao id_category (relacionamento de produtos com categorias).
  const products = await sql/*sql*/ `
    SELECT name_product, price_product, name_category
    FROM products
    INNER JOIN categories ON products.id_category = categories.id
  `;

  return res.status(200).json({ products });
});

app.listen(3333, () => {
  console.log("server rodando na porta 3333");
});
