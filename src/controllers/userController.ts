import { Response, Request } from 'express';
import createTable from '../database/createTables/createLogin'
import User from '../Models/user';

export default {

  index(req: Request, res: Response){

    return new Promise((resolve, reject) => {

      let user = new User(req.params.user_id);
      user.getUserFromDatabase().then(result=> {

        res.send(result);
    
      }).then(result=>{
        resolve(result);
      }).catch(err => reject(err));

    });

  },

  save(req: Request, res: Response){

    return new Promise((resolve, reject) =>{

      const {name, email, password} = req.body;

      createTable.createLogin().then(results=>{

        let user = new User(undefined, name, email, password);

        user.insertUserToDatabase().then(result=>{
         resolve(result);
         res.send('User inserted successfully');
        }).catch(err=>console.log(err));
        
      }).catch(err => reject(err));

    });

  },

  delete(req: Request, res: Response){

    return new Promise((resolve, reject) =>{

      const id = req.params.user_id;

      let user = new User(id);

      user.removeUserFromDatabase().then(result=>{
        resolve(result);
        res.send('User deleted successfully');
      }).catch(err => reject(err));

    });

  },

  update(req: Request, res: Response){

    return new Promise((resolve, reject) =>{

      const id = req.params.user_id;
      const{name, email, password} = req.body;

      let user = new User();

      user.updateUserInformation(id, name, email, password).then(result=>{

        resolve(result);
        res.send(`User Updated Successfully`);
    
      }).catch(err => reject(err));

    });

  }

}