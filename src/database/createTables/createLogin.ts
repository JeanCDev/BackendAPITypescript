import connection from '../database';

export = {

    createLogin(){

      return new Promise((resolve, reject) => {

        connection.query(`
          CREATE TABLE IF NOT EXISTS login(
            user_id serial not null,
            user_name varchar(256) not null,
            user_password varchar(32) not null,
            user_email varchar(256) not null,
          PRIMARY KEY (user_id)
          );
        `,[], (err, result) => {
  
          if(err){
            return reject(err);
          } else {
            resolve('Table created successfully',);
          }
  
        });

      });

    }

  }