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

app.listen(3333, () => {
  console.log("server rodando na porta 3333");
});
