import { Request, Response } from "express";
import express from 'express';
import routes from './routes/routes';

const PORT = process.env.PORT;

const cors = require('cors');
const app = express();

const CORS_OPTIONS = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(CORS_OPTIONS));

routes(app);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).send('Hello 🐄');
});

app.listen(PORT || 8000, () => {
  console.log("Started milking 🐄");
})