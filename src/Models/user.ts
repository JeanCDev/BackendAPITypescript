import connection from "../database/database";

export default class User{

  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;

  constructor(id?: string, name?: string, email?: string, password?: string){

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;

  }

  insertUserToDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(`
          insert into login (user_name, user_password, user_email)
          values($1, $2, $3);
      `,[this.name, this.password, this.email], (err, result) =>{

        if(err){
          return reject(err);
        } else {
          resolve(result);
        }

      });

    });

  }

  getUserFromDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(`
        select * from login where user_id = $1;
      `,[this.id], (err, result) => {

        if(err){
          console.log(err);
        } else {
          resolve(result.rows);
        }

      });

    });

  }

  removeUserFromDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(`
        DELETE FROM login
          WHERE user_id=$1;
      `,[this.id], (err, result) =>{

        if(err){
          return reject(err);
        } else {
          resolve(result);
        }

      });

    });

  }

  updateUserInformation(id: string, name: string, email: string, password:string){

    return new Promise((resolve, reject) =>{

      connection.query(`
        UPDATE login
          SET user_name = $1,
          user_email = $2,
          user_password = $3
        WHERE user_id = $4
      `,[name, email, password, id], (err, result) =>{

        if(err){
          return reject(err);
        } else {
          resolve(result.rowCount);
        }

      });

    });

  }

}