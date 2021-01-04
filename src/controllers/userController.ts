import { Response, Request } from 'express';
import createTable from '../database/createTables';
import User from '../Models/user';
import jwt from 'jsonwebtoken';

export default {

  index(req: Request, res: Response){
    try{  
      User.getAllUsers().then(result=>{

        res.send(result);       

      }).catch(err => res.send(err.message));
    } catch (err) {

      res.send(err.message);

    }

  },

  get(req: Request, res: Response){

    try{

      let id = Number(req.params.user_id);

      let user = new User();
      user.getUserFromDatabase(id).then(result=> {

        res.send(result);
    
      }).catch(err => res.send('User not found'));    
      
    } catch (err) {

      res.send(err.message);

    }

  },

  async save(req: Request, res: Response){

    try {
      const {name, email, password} = req.body;

      await createTable.createLogin().then(()=>{

        if((name === '' || name === null || name === undefined) ||
          (email=== '' || email===null || email===undefined) ||
          (password==='' || password===null || password===undefined)
          ){
         
            res.send('Missing required fields');

          } else {

            let user = new User();

            user.insertUserToDatabase(name, email, password).then(()=>{

              res.send('User inserted successfully');
     
             }).catch(err=>res.send(err.message));

          }
        
      }).catch(err => res.send(err.message));
    
    } catch (err){

      res.send(err.message);

    }

  },

  async validate(req: Request, res: Response){

      try {
        const {email, password} = req.body;

        const user = new User();

        await user.validateLogin(email, password).then((result: any) => {

          const tokenSecret = String(process.env.TOKEN_SECRET);

          const token = jwt.sign({
            id: result.id,
            email: result.email
          }, tokenSecret,{
            expiresIn:43200
          });

          res.header("auth-token", token).send(token);
    
        }).catch(err => res.send('Email or password incorrect!'));
      } catch (err) {

        res.send(err.message);

      }

  },

  async delete(req: Request, res: Response){

      try{
        const id = Number(req.params.user_id);

        let user = new User();

        await user.getUserFromDatabase(id).then(async() =>{

          await user.removeUserFromDatabase().then(()=>{

            res.send('User deleted successfully');
  
          }).catch(err =>  res.send(err.message));

        }).catch(err => res.send(err.message)); 

      } catch(err){

        res.send(err.message);

      }

  },

  async update(req: Request, res: Response){

      try{

        const id = Number(req.params.user_id);
        const{name, email, password} = req.body;

        let user = new User();

        await user.getUserFromDatabase(id).then(async()=>{

          await user.updateUserInformation(name, email, password).then(()=>{

            res.send(`User Updated Successfully`);
      
          }).catch(err => res.send(err.message) );

        }).catch(err => res.send(err.message));

      } catch (err) {

        res.send(err.message);

      }

  }

}