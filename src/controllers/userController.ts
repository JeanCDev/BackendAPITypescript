import user from '../Models/user';
import { Response, Request } from 'express';
import createTable from '../database/createTables/createLogin'

export default {

  index(req: Request, res: Response){

    return new Promise((resolve, reject) => {

      user.getUsersFromDatabase().then(result=> {

        res.send(result);
    
      }).then(result=>{
        resolve(result);
      }).catch(err => reject(err));

    });

  },

  save(req: Request, res: Response){

    return new Promise((resolve, reject) =>{

      createTable.createLogin().then(results=>{

        user.insertUserToDatabase(req, res).then(result=>{
         resolve(result);
         res.send('User inserted successfully');
        }).catch(err=>console.log(err));
        
      }).catch(err => reject(err));

    });

  },

  delete(req: Request, res: Response){

    return new Promise((resolve, reject) =>{

      user.removeUserFromDatabase(req).then(result=>{
        resolve(result);
        res.send('User deleted successfully');
      }).catch(err => reject(err));

    });

  },

  update(req: Request, res: Response){

    return new Promise((resolve, reject) =>{

      user.updateUserInformation(req).then(result=>{

        resolve(result);
        res.send(`User Updated Successfully`);
    
      }).catch(err => reject(err));

    });

  }

}