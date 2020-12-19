import path from "path";

import express from 'express';
import routes from './routes';
import 'dotenv/config';
//import cors from 'cors';

const app = express();

/* let corsOptions = {
  origin: process.env.ACCESS_ORIGIN,
  optionsSuccessStatus: 200,
}; */

//app.use(cors(corsOptions));

app.use((req, res, next) => {

  res.header(
    'Access-Control-Allow-Origin', 
    process.env.ACCESS_ORIGIN
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();

});

app.use(express.json());

app.use(express.urlencoded({ extended: true }))
app.use(routes);

app.use("/uploads", express.static(path.join(__dirname, '..', "uploads")));

app.listen(process.env.PORT, ()=> {
  console.log('Server Started');
});