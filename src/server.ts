import express from 'express';
import routes from './routes';
import 'dotenv/config';
import cors from 'cors';

const app = express();

let corsOptions = {
  origin: process.env.ACCESS_ORIGIN,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }))
app.use(routes);

app.listen(process.env.PORT, ()=> {
  console.log('Server Started');
});