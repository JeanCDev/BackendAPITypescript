import connection from '../database';
import fs from 'fs';

export default class Project{

  private projectId: number | undefined;
  private projectName: string | undefined;
  private projectDescription: string | undefined;
  private githubUrl: string | undefined;
  private projectLink: string | undefined;
  private projectImageUrl: string | undefined;

  constructor(){

      this.projectId;
      this.projectName;
      this.projectDescription;
      this.githubUrl;
      this.projectLink;
      this.projectImageUrl;

  }

  get id() {
    return this.projectId;
  }
  set id(value) {
    this.projectId = value;
  }
  get name() {
    return this.projectName;
  }
  set name(value) {
    this.projectName = value;
  }
  get description() {
    return this.projectDescription;
  }
  set description(value) {
    this.projectDescription = value;
  }
  get link() {
    return this.projectLink;
  }
  set link(value) {
    this.projectLink = value;
  }
  get imageUrl() {
    return this.projectImageUrl;
  }
  set imageUrl(value) {
    this.projectImageUrl = value;
  }
  get github() {
    return this.githubUrl;
  }
  set github(value) {
    this.githubUrl = value;
  }

  insertProjectToDatabase(
    name: string, description: string,
    githubUrl: string, projectLink: string,
    imageUrl: string
    ){

    return new Promise((resolve, reject) =>{

      const imgURL = imageUrl.replace(`\\`,'/');

      connection.query(`
        INSERT INTO projects(
          project_name,
          project_description,
          project_github_url,
          project_link,
          project_image_link
        ) VALUES ($1, $2, $3, $4, $5);
      `,[
        name, description, 
        githubUrl, projectLink, imgURL], (err, result)=>{

          if(err){
            reject(err);
          } else {
            resolve(result);
          }

        });

    });

  }

  static getAllProjects(){

    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM projects ORDER BY project_id;
      `,[], (err, result)=>{

        let projects: Project[] = [];

        result.rows.forEach(row=>{

          let project = new Project();

          project.fillProjectInformation(row);

          projects.push(project);

        });

        if (err){
          reject(err);
        } else {
          resolve(projects);
        }

      });

    });

  }

  getProjectById(id: number){
    
    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM projects WHERE project_id = $1
      `,[id], (err, result)=>{

        if(!result.rows.length || !result.rows[0] == undefined){
          reject(err);
        } else {
          this.fillProjectInformation(result.rows[0]);
        }

        if(err){
          reject(err);
        } else {
          resolve(this);
        }

      });

    });

  }

  deleteProject(){

    return new Promise((resolve, reject) =>{

      connection.query(`
        DELETE FROM projects WHERE project_id = $1;`,
        [this.id], (err, result)=>{

          fs.unlink(String(this.imageUrl), err =>{

            if(err){
              reject(err);
              return;
            }

          });

          if(err){
            reject(err);
          } else {
            resolve(result);
          }

        }
      );

    });

  }

  updateProjectInformation(
    newName: string, 
    newDescription: string, 
    newGithubUrl: string, 
    newProjectLink: string, 
    newProjectImageLink: string)
  {

    return new Promise((resolve, reject) =>{

      fs.unlink(String(this.imageUrl), err =>{

        if(err){
          reject(err);
          return;
        }

      });

      connection.query(`
      UPDATE projects 
        SET project_name = $1,
        project_description = $2,
        project_github_url = $3,
        project_link = $4,
        project_image_link = $5
      WHERE project_id = $6;
      `, [newName, newDescription, 
          newGithubUrl, newProjectLink, newProjectImageLink,
          this.id], (err, result)=>{

        if(err){
          reject(err);
        } else {
          resolve(result)
        }

      });

    });

  }

  fillProjectInformation(data: any){

    this.id = data.project_id;
    this.name = data.project_name;
    this.description = data.project_description;
    this.github = data.project_github_url;
    this.link = data.project_link;
    this.imageUrl= data.project_image_link;

  }

}