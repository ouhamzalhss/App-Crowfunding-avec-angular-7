import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../../models/Project';
import {API_URL} from '../../app.constants';
import {Router} from '@angular/router';
import {Contribution} from '../../models/Contribution';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private jwtToken: string=null;

  constructor(private http: HttpClient,public router: Router) { }

  loadToken(){
    this.jwtToken = localStorage.getItem('token');
  }

  getProjects() {
   // if(this.jwtToken==null) this.loadToken();
    //return this.http.get<Project[]>(`${API_URL}/projects`,{headers:new HttpHeaders({'Authorization': this.jwtToken})});
    return this.http.get<Project[]>(`${API_URL}/projects`);
  }

  getProjectsByType(id: number) {
    // if(this.jwtToken==null) this.loadToken();
    //return this.http.get<Project[]>(`${API_URL}`+"/typesProjects/"+id+"/projets",{headers:new HttpHeaders({'Authorization': this.jwtToken})});
    return this.http.get<Project[]>(`${API_URL}`+"/typesProjects/"+id+"/projets");
  }
  getOneProject(id: number) {
    // if(this.jwtToken==null) this.loadToken();
    //return this.http.get<Project[]>(`${API_URL}`+"/typesProjects/"+id+"/projets",{headers:new HttpHeaders({'Authorization': this.jwtToken})});
    return this.http.get<Project>(`${API_URL}`+"/projects/"+id);
  }

  addProject(project: Project) {
    return this.http.post<Project>(`${API_URL}`+"/projects" , project);
  }

  getProjectsSearch(projectSerach: string) {
    return this.http.get<Project[]>(`${API_URL}`+"/projects/search/projectsByKeyword?mc="+projectSerach);
  }

  showProject(id: any) {
    this.router.navigate(['project',id])
  }

  getProjectsSearchByType(typeSerach: number) {
    return this.http.get<Project[]>(`${API_URL}`+"/typesProjects/"+typeSerach+"/projets");
  }

  getLastProject() {
    return this.http.get<Project>(`${API_URL}`+"/projects/search/getLastProject");
  }

  getProjectsByAdresse(projectAdresse: number) {
    return this.http.get<Project>(`${API_URL}`+"/adresses/"+projectAdresse+"/projet");
  }

  getTotalMontantInvistissement(idProject:number) {
    return this.http.get<Contribution[]>(`${API_URL}`+"/projects/"+idProject+"/contributions");
  }
}
