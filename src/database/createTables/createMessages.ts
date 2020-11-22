import connection from '../database';

export default {

    createMessages(){

      return new Promise((resolve, reject) => {

        connection.query(`
          CREATE TABLE IF NOT EXISTS messages(
            message_id serial not null,
            user_name varchar(256) not null,
            user_email varchar(32) not null,
            user_phone varchar(32),
            message_subject varchar(512) not null,
            message_text varchar(512) not null,
          PRIMARY KEY (message_id)
          );
        `,[], (err, result) => {
  
          if(err){
            return reject(err);
          } else {
            resolve(result);
          }
  
        });

      });

    }

}