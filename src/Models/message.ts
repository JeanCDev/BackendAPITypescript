import connection from '../database';
export default class Message{

  private messageId: number | undefined;
  private clientName: string | undefined;
  private clientEmail: string | undefined;
  private messageSubject: string | undefined;
  private message: string | undefined;
  private clientPhone: string | undefined;

  constructor(){

      this.messageId;
      this.clientName;
      this.clientEmail;
      this.messageSubject;
      this.message;
      this.clientPhone;

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
  
  insertMessageToDatabase(
    userName: string, userEmail: string,
    userPhone: string, messageSubject: string,
    messageText: string
    ){

    return new Promise((resolve, reject) =>{

      connection.query(
        `INSERT INTO messages (
          user_name, 
          user_email, 
          user_phone,
          message_subject,
          message_text) VALUES ($1, $2, $3, $4, $5)`,[
            userName, userEmail, userPhone, 
            messageSubject, messageText
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

          let message = new Message();

          message.fillMessageData(row);

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

  getMessageFromDatabase(id: number){

    return new Promise((resolve, reject) =>{

      connection.query(
        `SELECT * FROM messages WHERE message_id = $1`,
        [id], (err, result) =>{

          if(result.rows.length === 0){

            reject(err);

          } else {

            this.fillMessageData(result.rows[0]);

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

  fillMessageData(data: any){

      this.id = data.message_id;
      this.userName = data.user_name;
      this.userEmail = data.user_email;
      this.userPhone = data.user_phone;
      this.messageSubject = data.message_subject;
      this.messageText = data.message_text;

  }

}