import {Request, Response} from 'express';
import createTable from '../database/createTables';
import Message from '../Models/message';

export default {

  async index(req: Request, res: Response){

    try {
      await Message.getAllMessagesFromDatabase().then(result => {

        res.send(result);

      }).catch(err =>  res.send(err.message));
    } catch (err) {

      res.send(err.message);

    }

  },

  async save(req: Request, res: Response){

      try{
        await createTable.createMessages().then(async()=>{

        const {
          user_name, user_email, user_phone,
          message_text, message_subject
        } = req.body; 

        if((user_name === '' || user_name === null || user_name === undefined) ||
          (user_email=== '' || user_email===null || user_email===undefined) ||
          (message_subject=== '' || message_subject===null  || message_subject===undefined) ||
          (message_text=== '' || message_text===null || message_text===undefined)
          ){

            res.send('Missing data');

          } else {

            let message = new Message();

            await message.insertMessageToDatabase(
              user_name, user_email, user_phone, message_subject, message_text
            ).then(result => {
          
              res.send(result);
      
            }).catch(err =>  res.send(err.message));

          }
  
      }).catch(err => res.send(err.message));

    } catch (err) {

      res.send(err.message);

    }

  },

  async get(req: Request, res: Response){

    try{
      const {message_id} = req.params;

      const id = Number(message_id);

      let message = new Message();

      await message.getMessageFromDatabase(id).then(result => {
        res.send(result);
      }).catch(err => res.send('Message not found'));

    } catch (err) {

      res.send(err.message);

    }

  },

  async delete(req: Request, res: Response){

    try{
      
      const {message_id} = req.params;

      const id = Number(message_id);

      let message = new Message();

      await message.getMessageFromDatabase(id).then(async () =>{

        await message.deleteMessageFromDatabase().then(() => {

          res.send('Message Deleted Successfully');
  
        }).catch(err => res.send(err.message));

      }).catch(err => res.send(err.message));
      
    } catch (err) {

      res.send(err.message);

    }

  }

}