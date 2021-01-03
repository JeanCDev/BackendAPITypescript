import connection from "../database";
import bcrypt from "bcrypt";

export default class User{

  private userId: number | undefined;
  private userName: string | undefined;
  private userEmail: string | undefined;
  private userPassword: string | undefined | void;

  constructor(){

    this.userId;
    this.userName;
    this.userEmail;
    this.userPassword;

  }

  get id(){
    return this.userId;
  }
  set id(value){
    this.userId = value;
  }
  get name(){
    return this.userName;
  }
  set name(value){
    this.userName = value;
  }
  get email(){
    return this.userEmail;
  }
  set email(value){
    this.userEmail = value;
  }
  get password(){
    return this.userPassword;
  }
  set password(value){
    this.userPassword = value;
  }

  static getAllUsers(){

    return new Promise((resolve, reject) =>{

      connection.query(`
      SELECT * FROM login ORDER BY user_id`, 
      [], (err, result) =>{
        
        let users: object[] = [];

        result.rows.forEach(row =>{

          let user = new User();

          console.log(row);

          user.fillUserData(row);

          users.push(user);

        });

        if(err){
          return reject(err);
        } else {
          resolve(users);
        }

      });

    });

  }

  insertUserToDatabase(name: string, email: string, password: string){

    return new Promise((resolve, reject) =>{

      this.hashPassword(password).then(hash => {

        connection.query(`
          INSERT INTO login (user_name, user_password, user_email)
          VALUES($1, $2, $3);
        `,[name, hash, email], (err, result) =>{

          if(err){
            reject(err);
          } else {
            resolve(result);
          }

        });
        
      });

    });

  }

  getUserFromDatabase(id: number){

    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM login WHERE user_id = $1;
      `,[id], (err, result) => {


        if(result.rows.length === 0){

          reject(err);

        } else {

          this.fillUserData(result.rows[0]);

        }

        if(err){
          reject(err);
        } else {
          resolve(this);
        }

      });

    });

  }

  validateLogin(email: string, password: string){

    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM login WHERE user_email = $1
      `,[email], (err, results) =>{

        if(!results.rows[0]){
          reject(err);
        } else{
          
          let hash = results.rows[0].user_password;

          this.compareHashWithPassword(password, hash).then(result =>{

            if(result === false){
              reject(err);
            } else {
              this.fillUserData(results.rows[0]);
            }
    
            if(err){
              reject(err);
            } else {
              resolve(this);
            }

          });

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
          reject(err);
        } else {
          resolve(result);
        }

      });

    });

  }

  updateUserInformation(newName: string, 
    newEmail: string, newPassword: string){

    return new Promise((resolve, reject) =>{

       this.hashPassword(newPassword).then(hash => {

        connection.query(`
            UPDATE login
              SET user_name = $1,
              user_email = $2,
              user_password = $3
            WHERE user_id = $4
          `,[newName, 
            newEmail, 
            hash, this.id], (err, result) =>{

            if(err){
              reject(err);
            } else {
              resolve(result.rowCount);
            }

          });

       }); 

    });

  }

  fillUserData(data: any){
    
      this.id = data.user_id;
      this.name = data.user_name;
      this.password = data.user_password;
      this.email = data.user_email;

  }

  hashPassword(password: string){

    return new Promise((resolve, reject)=>{

      bcrypt.hash(password, 10, (err, hash)=>{

        if(err){
          reject(err);
        }else{
          resolve(hash);
        }

      });

    });

  }

  compareHashWithPassword(password: string, hash: string){

    return new Promise((resolve, reject)=>{

      bcrypt.compare(password, hash, (err, result)=>{

        if(err){
          reject(err);
        } else {
          resolve(result);
        }

      });

    });

  }

}