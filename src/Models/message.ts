import connection from '../database';
export default class Message{

  private _messageId: string | undefined;
  private _userName: string | undefined;
  private _userEmail: string | undefined;
  private _messageSubject: string | undefined;
  private _messageText: string | undefined;
  private _userPhone: string | undefined;

  constructor(
    messageId?:string,
    userName?: string, 
    userEmail?: string, 
    messageSubject?: string, 
    messageText?: string,
    userPhone?: string){

      this._messageId = messageId;
      this._userName = userName;
      this._userEmail = userEmail;
      this._messageSubject = messageSubject;
      this._messageText = messageText;
      this._userPhone = userPhone;

    }

  get id() {
    return this._messageId;
  }
  set id(value) {
    this._messageId = value;
  }
  get userName() {
    return this._userName;
  }
  set userName(value) {
    this._userName = value;
  }
  get userEmail() {
    return this._userEmail;
  }
  set userEmail(value) {
    this._userEmail = value;
  }
  get messageSubject() {
    return this._messageSubject;
  }
  set messageSubject(value) {
    this._messageSubject = value;
  }
  get messageText() {
    return this._messageText;
  }
  set messageText(value) {
    this._messageText = value;
  }
  get userPhone() {
    return this._userPhone;
  }
  set userPhone(value) {
    this._userPhone = value;
  }
  
  insertMessageToDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(
        `INSERT INTO messages (
          user_name, 
          user_email, 
          user_phone,
          message_subject,
          message_text) VALUES ($1, $2, $3, $4, $5)`,[
            this.userName, this.userEmail, this.userPhone, 
            this.messageSubject, this.messageText
          ], (err, result)=>{

            if(err){
              reject(err);
            } else {
              resolve('Message successfully sent');
            }

          });

    });

  }

  static getAllMessagesFromDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query('SELECT * FROM messages',[],(err, result)=>{

        let messages:object[] = [];

        result.rows.forEach((row)=>{

          let message = new Message(
            row.user_name,
            row.user_email, 
            row.message_subject,
            row.message_text,
            row.user_phone
          );

          if(message){
            message.id = row.message_id;
          }

          messages.push(message);

        });

        if(err){
          reject(err);
        } else {
          resolve(messages);
        }

      });

    });

  }

  getMessageFromDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(
        `SELECT * FROM messages WHERE message_id = $1`,
        [this.id], (err, result) =>{

          this.fillMessageData(result.rows);

          if(err){
            reject(err);
          } else {
            resolve(this);
          }

        }
      )

    });

  }

  deleteMessageFromDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(
        `DELETE FROM messages WHERE message_id = $1`,
        [this.id], (err, result) =>{

          if(err){
            reject(err);
          } else {
            resolve(result);
          }

        }
      )

    });

  }

  fillMessageData(data: object[]){

    data.forEach((row:any) =>{

      this.id = row.message_id;
      this.userName = row.user_name;
      this.userEmail = row.user_email;
      this.userPhone = row.user_phone;
      this.messageSubject = row.message_subject;
      this.messageText = row.message_text;

    });

  }

}