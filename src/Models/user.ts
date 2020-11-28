import connection from "../database";

export default class User{

  private _id: string | undefined;
  private _name: string | undefined;
  private _email: string | undefined;
  private _password: string | undefined;

  constructor(id?: string, name?: string, email?: string, password?: string){

    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;

  }

  get id(){
    return this._id;
  }
  set id(value){
    this._id = value;
  }
  get name(){
    return this._name;
  }
  set name(value){
    this._name = value;
  }
  get email(){
    return this._email;
  }
  set email(value){
    this._email = value;
  }
  get password(){
    return this._password;
  }
  set password(value){
    this._password = value;
  }

  static getAllUsers(){

    return new Promise((resolve, reject) =>{

      connection.query(`select * from login order by user_id`, [], (err, result) =>{

        let users: object[] = [];

        result.rows.forEach(row =>{

          let user = new User(
            row.user_id, 
            row.user_name,
            row.user_email,
            row.user_password
          );

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

  insertUserToDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(`
          insert into login (user_name, user_password, user_email)
          values($1, $2, $3);
      `,[this.name, this.password, this.email], (err, result) =>{

        if(err){
          reject(err);
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

        this.fillUserData(result.rows);

        if(err){
          reject(err);
        } else {
          resolve(this);
        }

      });

    });

  }

  ////////////////////////////////////////////////////////////////
  // À implementar

  /* search(){
    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM login WHERE user_name LIKE $1
      `,[this.name], (err, result) =>{
        
        this.fillUserData(result.rows);

        if(err){
          reject(err);
        } else {
          resolve(this);
        }

      });

    });
  } */
  
  // À implementar
  ////////////////////////////////////////////////////////////////

  validateLogin(){

    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM login WHERE user_email = $1 AND user_password = $2
      `,[this.email, this.password], (err, result) =>{

        if(!result.rows.length){
          reject('Login e/ou senha inválidos');
        } else {
          this.fillUserData(result.rows);
        }

        if(err){
          reject(err);
        } else {
          resolve(this);
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
          reject(err);
        } else {
          resolve(result.rowCount);
        }

      });

    });

  }

  fillUserData(data: object[]){

    data.forEach((row:any) =>{

      this.id = row.user_id;
      this.name = row.user_name;
      this.password = row.user_password;
      this.email = row.user_email;

    });

  }

}