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
  
        let message = new Message(
          undefined,
          user_name, user_email,  
          message_subject, message_text, 
          user_phone
        );

        if((user_name === '' || user_name === null || user_name === undefined) ||
          (user_email=== '' || user_email===null || user_email===undefined) ||
          (message_subject=== '' || message_subject===null  || message_subject===undefined) ||
          (message_text=== '' || message_text===null || message_text===undefined)
          ){

            res.send('Missing data');

          } else {

            await message.insertMessageToDatabase().then(result => {
          
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

      let message = new Message(message_id);

      await message.getMessageFromDatabase().then(result => {
        res.send(result);
      }).catch(err => res.send(err.message));

    } catch (err) {

      res.send(err.message);

    }

  },

  async delete(req: Request, res: Response){

    try{
      
      const {message_id} = req.params;

      let message = new Message(message_id);

      await message.deleteMessageFromDatabase().then(result => {

        res.send(result);

      }).catch(err => res.send(err.message));
      
    } catch (err) {

      res.send(err.message);

    }

  }

}