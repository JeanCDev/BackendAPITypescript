import connection from '../database';
export default class Message{

  private messageId: number | undefined;
  private clientName: string | undefined;
  private clientEmail: string | undefined;
  private messageSubject: string | undefined;
  private message: string | undefined;
  private clientPhone: string | undefined;

  constructor(
    messageId?:number,
    userName?: string, 
    userEmail?: string, 
    msgSubject?: string, 
    messageText?: string,
    userPhone?: string){

      this.messageId = messageId;
      this.clientName = userName;
      this.clientEmail = userEmail;
      this.messageSubject = msgSubject;
      this.message = messageText;
      this.clientPhone = userPhone;

    }

  get id() {
    return this.messageId;
  }
  set id(value) {
    this.messageId = value;
  }
  get userName() {
    return this.clientName;
  }
  set userName(value) {
    this.clientName = value;
  }
  get userEmail() {
    return this.clientEmail;
  }
  set userEmail(value) {
    this.clientEmail = value;
  }
  get msgSubject() {
    return this.messageSubject;
  }
  set msgSubject(value) {
    this.messageSubject = value;
  }
  get messageText() {
    return this.message;
  }
  set messageText(value) {
    this.message = value;
  }
  get userPhone() {
    return this.clientPhone;
  }
  set userPhone(value) {
    this.clientPhone = value;
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

          if(result.rows.length === 0){

            reject(err);

          } else {

            this.fillMessageData(result.rows);

          }

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