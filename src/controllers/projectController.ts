import createTable from '../database/createTables';
import {Request, Response} from 'express';
import Project from '../Models/project';

export default {

  async index(req: Request, res: Response){

    try {

      await Project.getAllProjects().then(result=>{

        res.send(result);

      }).catch(err => res.send('No projects found'))

    } catch (err) {
      res.send(err.message);
    }

  },

  async save(req: Request, res: Response){

    try {
      
      const {
        name,
        description,
        link,
        image_url,
        github_url,
      } = req.body;

      createTable.createProjects().then(async ()=>{


        if((name === '' || name === null || name === undefined) ||
          (description === '' || description === null || description === undefined) ||
          (github_url === '' || github_url === null || github_url === undefined)
        ){

          res.send('Missing data');
  
        } else {

          let project = new Project(
            undefined, 
            name, description, 
            github_url, link, image_url);
          
          await project.insertProjectToDatabase().then(result=>{
  
            res.send('Project inserted successfully');
  
          }).catch(err => res.send(err.message));

        }

      }).catch(err => res.send(err.message));        
    
    }
    catch(err) {
      res.send(err.message);
    }

  },

  async get(req: Request, res: Response){

    try {

      const id = Number(req.params.project_id);

      let project = new Project(id);

      await project.getProjectById().then(result => {

        res.send(result);

      }).catch(err => res.send('Project not found'));

    }catch(err) {
      res.send(err.message);
    }

  },

  async update(req: Request, res: Response){

    try {

      const id = Number(req.params.project_id);
      
      const{
        name, description,
        link, image_url, github_url
      } = req.body;

      if((name === '' || name === null || name === undefined) ||
          (description === '' || description === null || description === undefined) ||
          (github_url === '' || github_url === null || github_url === undefined)
        ){

          res.send('Missing data');

        } else {

          let project = new Project(id);

          project.updateProjectInformation(
            name, description, 
            github_url, link, image_url
          ).then((result)=>{

            res.send('Project updated successfully');

          }).catch(err => res.send(err.message));

        }

    } catch(err) {
      res.send(err.message);
    }

  },

  async delete(req: Request, res: Response){

    try {

      const id = Number(req.params.project_id);

      let project = new Project(id);

      await project.deleteProject().then((result) =>{

        res.send('Project deleted successfully');

      }).catch((err) => res.send(err.message));

    }catch(err){
      res.send(err.message);
    }

  }

}