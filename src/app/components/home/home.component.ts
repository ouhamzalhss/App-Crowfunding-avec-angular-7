import { Component, OnInit } from '@angular/core';
import {TypeProject} from '../../models/TypeProject';
import {Router} from '@angular/router';
import {ProjectService} from '../../services/projects/project.service';
import {TypeService} from '../../services/typesProjects/type.service';
import {Project} from '../../models/Project';
import {AdresseService} from '../../services/adresses/adresse.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  projects: Project[];
  projectByAdress: Project;
  adresses: any[];
  typesProjects: TypeProject[];
  private currentType: TypeProject;
  mode: number=0;
  showAllTypes: boolean=false;
  // for search form
  projectSerach: string=null;
  typeSerach: number=0;
  projectAdresse: number=0;
  private lastproject: Project;
  private allProjects: Project[];

  constructor(private router: Router,
              public projectService: ProjectService,
              private typeProjectService: TypeService,
              private adresseService: AdresseService) { }

  ngOnInit() {
    this.getTypesProjects();
    this.getLastProject();
    this.getAdressesProjects();
    this.getAllProjects();

  }


  getTypesProjects(){
    this.typeProjectService.getTypes().subscribe(
      response => {
        console.log(response);
        this.typesProjects = response;
      }
    )
  }

  getAdressesProjects(){
    this.adresseService.getAdresses().subscribe(
      response => {
        console.log(response);
        this.adresses = response;
      }
    )
  }

  getProjectsByType(type: TypeProject) {
      this.currentType = type;
      this.mode=1;
      //console.log(type.id)
      this.projectService.getProjectsByType(type.id).subscribe(
      response => {
        this.projects = response;
      }
    )
  }

 onShowAllTypes(){
    this.showAllTypes = !this.showAllTypes;
 }


  onSearch() {
    //console.log(this.projectSerach)

    if(this.projectSerach!=null){
      this.projectService.getProjectsSearch(this.projectSerach)
        .subscribe(data=>{
          this.projectByAdress=null
          this.mode=1;
          this.projects = data;
        },err=>{
          console.log(err);
        });
    }

    if(this.projectAdresse!=0){
      this.projectService.getProjectsByAdresse(this.projectAdresse)
        .subscribe(data=>{

          this.mode=1;
          this.projectByAdress=data;
        },err=>{
          console.log(err);
        });
    }

    if(this.typeSerach!=0){
      this.projectService.getProjectsSearchByType(this.typeSerach)
        .subscribe(data=>{
          this.projectByAdress=null
          this.mode=1;
          this.projects = data;
        },err=>{
          console.log(err);
        });
    }

  }

  getLastProject(){
    this.projectService.getLastProject().subscribe(
      data=>{
        this.lastproject = data;
      },err=>{
        console.log(err);
      })
  }

  getAllProjects(){
    this.projectService.getProjects().subscribe(
      response => {
        console.log(response);
        this.allProjects = response;
      }
    )
  }

  displayDesc(descriptionProjet: string) {
    if(descriptionProjet.length >= 65) {
      descriptionProjet = descriptionProjet.substring(0, 62) + '...';
    }
    return descriptionProjet
  }
}
