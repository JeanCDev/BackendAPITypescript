import connection from "../database";

export default class User{

  private userId: number | undefined;
  private userName: string | undefined;
  private userEmail: string | undefined;
  private userPassword: string | undefined;

  constructor(id?: number, name?: string, email?: string, password?: string){

    this.userId = id;
    this.userName = name;
    this.userEmail = email;
    this.userPassword = password;

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
          INSERT INTO login (user_name, user_password, user_email)
          VALUES($1, $2, $3);
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
        SELECT * FROM login WHERE user_id = $1;
      `,[this.id], (err, result) => {


        if(result.rows.length === 0){

          reject(err);

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

        if(!result.rows.length || !result.rows[0] == undefined){
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

  updateUserInformation(newName: string, 
    newEmail: string, newPassword: string){

    return new Promise((resolve, reject) =>{

      connection.query(`
        UPDATE login
          SET user_name = $1,
          user_email = $2,
          user_password = $3
        WHERE user_id = $4
      `,[newName, 
        newEmail, 
        newPassword, this.id], (err, result) =>{

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