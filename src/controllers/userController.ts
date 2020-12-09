import { Response, Request } from 'express';
import createTable from '../database/createTables';
import User from '../Models/user';

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

      let user = new User(id);
      user.getUserFromDatabase().then(result=> {

        res.send(result);
    
      }).catch(err => res.send('User not found'));    
      
    } catch (err) {

      res.send(err.message);

    }

  },

  ////////////////////////////////////////////////////////////////
  // À IMPLEMENTAR

  /* search(req: Request, res: Response){



  }, */

  // À IMPLEMENTAR
  ////////////////////////////////////////////////////////////////

  async save(req: Request, res: Response){

    try {
      const {name, email, password} = req.body;

      await createTable.createLogin().then(()=>{

        let user = new User(undefined, name, email, password);

        if((name === '' || name === null || name === undefined) ||
          (email=== '' || email===null || email===undefined) ||
          (password==='' || password===null || password===undefined)
          ){
         
            res.send('Missing required fields');

          } else {

            user.insertUserToDatabase().then(()=>{

              console.log(user);
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

        const user = new User(undefined, undefined, email, password);

        await user.validateLogin().then(result => {

          res.send(result);
    
        }).catch(err => res.send(err.message));
      } catch (err) {

        res.send(err.message);

      }

  },

  async delete(req: Request, res: Response){

      try{
        const id = Number(req.params.user_id);

        let user = new User(id);

        await user.removeUserFromDatabase().then(()=>{

          res.send('User deleted successfully');

        }).catch(err =>  res.send(err.message));

      } catch(err){

        res.send(err.message);

      }

  },

  async update(req: Request, res: Response){

      try{

        const id = Number(req.params.user_id);
        const{name, email, password} = req.body;

        let user = new User(id);

        await user.updateUserInformation(name, email, password).then(()=>{

          res.send(`User Updated Successfully`);
    
        }).catch(err => res.send(err.message) );

      } catch (err) {

        res.send(err.message);

      }

  }

}