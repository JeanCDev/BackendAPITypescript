import connection from '../database';

export default class Project{

  private projectId: number | undefined;
  private projectName: string | undefined;
  private projectDescription: string | undefined;
  private githubUrl: string | undefined;
  private projectLink: string | undefined;
  private projectImageUrl: string | undefined;

  constructor(
    id?: number, 
    name?: string, 
    description?: string,
    projectGithub?: string,
    link?: string,
    imageUrl?: string){

      this.projectId = id;
      this.projectName = name;
      this.projectDescription = description;
      this.githubUrl = projectGithub;
      this.projectLink = link;
      this.projectImageUrl = imageUrl;

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

  insertProjectToDatabase(){

    return new Promise((resolve, reject) =>{

      connection.query(`
        INSERT INTO projects(
          project_name,
          project_description,
          project_github_url,
          project_link,
          project_image_link
        ) VALUES ($1, $2, $3, $4, $5);
      `,[
        this.name, this.description, 
        this.githubUrl, this.link, this.imageUrl], (err, result)=>{

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

          let project = new Project(
            row.project_id, 
            row.project_name, row.project_description,
            row.project_github_url, row.project_link, 
            row.project_image_link
          );

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

  getProjectById(){
    
    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM projects WHERE project_id = $1
      `,[this.id], (err, result)=>{

        if(!result.rows.length || !result.rows[0] == undefined){
          reject(err);
        } else {
          this.fillProjectInformation(result.rows);
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

  fillProjectInformation(data: object[]){

    data.forEach((row:any) =>{

      this.id = row.project_id;
      this.name = row.project_name;
      this.description = row.project_description;
      this.github = row.project_github_url;
      this.link = row.project_link;
      this.imageUrl= row.project_image_link;

    });

  }

}