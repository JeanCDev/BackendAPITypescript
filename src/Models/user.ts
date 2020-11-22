import connection from "../database/database";
import {Request, Response} from 'express';

export default {

  insertUserToDatabase(req: Request, res: Response){

    return new Promise((resolve, reject) =>{

      connection.query(`
          insert into login (user_name, user_password, user_email)
          values($1, $2, $3);
      `,[req.body.name, req.body.password, req.body.email], (err, result) =>{

        if(err){
          return reject(err);
        } else {
          resolve(result);
        }

      });

    });

  },

  getUsersFromDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(`
        select * from login
      `,[], (err, result) => {

        if(err){
          console.log(err);
        } else {
          resolve(result.rows);
        }

      });

    });

  },

  removeUserFromDatabase(req: Request){

    const {user_id} = req.params;

    return new Promise((resolve, reject) =>{

      connection.query(`
        DELETE FROM login
          WHERE user_id=$1;
      `,[user_id], (err, result) =>{

        if(err){
          return reject(err);
        } else {
          resolve(result);
        }

      });

    });

  },

  updateUserInformation(req: Request){

    return new Promise((resolve, reject) =>{

      const {name, email, password} = req.body;

      const {user_id} = req.params;

      connection.query(`
        UPDATE login
          SET user_name = $1,
          user_email = $2,
          user_password = $3
        WHERE user_id = $4
      `,[name, email, password, user_id], (err, result) =>{

        if(err){
          return reject(err);
        } else {
          resolve(result.rowCount);
        }

      });

    });

  }

}