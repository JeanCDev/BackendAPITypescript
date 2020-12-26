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
        github_url,
      } = req.body;

      const image = req.file;

      createTable.createProjects().then(async ()=>{

        if((name === '' || name === null || name === undefined) ||
          (description === '' || description === null || description === undefined) ||
          (github_url === '' || github_url === null || github_url === undefined)
        ){

          res.status(500).send('Missing data');
  
        } else {

          let project = new Project();
          
          await project.insertProjectToDatabase(
            name, description, 
            github_url, link, image.path).then(result=>{
  
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

      let project = new Project();

      await project.getProjectById(id).then(result => {

        res.send(result);

      }).catch(err => res.send('Project not found'));

    }catch(err) {
      res.send(err.message);
    }

  },

  async update(req: Request, res: Response){

    try {

      const id = Number(req.params.project_id);
      
      const image = req.file;

      const{
        name, description,
        link, image_url, github_url
      } = req.body;

      if((name === '' || name === null || name === undefined) ||
          (description === '' || description === null || description === undefined) ||
          (github_url === '' || github_url === null || github_url === undefined)
        ){

          res.send({name, description, github_url});

        } else {

          let project = new Project();

          await project.getProjectById(id).then(async () =>{

            project.updateProjectInformation(
              name, description, 
              github_url, link, image.path
            ).then((result)=>{
  
              res.send('Project updated successfully');
  
            }).catch(err => res.send(err.message));

          }).catch(err => res.send(err.message));

        }

    } catch(err) {
      res.send(err.message);
    }

  },

  async delete(req: Request, res: Response){

    try {

      const id = Number(req.params.project_id);

      let project = new Project();

      await project.getProjectById(id).then(async ()=>{

        await project.deleteProject().then((result) =>{

          res.send('Project deleted successfully');
  
        }).catch((err) => res.send(err.message));

      }).catch(err => res.send(err.message));
      
    }catch(err){
      res.send(err.message);
    }

  }

}