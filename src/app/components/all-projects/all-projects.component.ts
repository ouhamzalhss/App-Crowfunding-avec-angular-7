import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../../services/projects/project.service';
import {Project} from '../../models/Project';
import {TypeService} from '../../services/typesProjects/type.service';
import {TypeProject} from '../../models/TypeProject';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent implements OnInit {
  projects: Project[];
  typesProjects: TypeProject[];
  private currentType: TypeProject;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private typeProjectService: TypeService) { }

  ngOnInit() {
    this.getAllProjects();
    this.getTypesProjects();
  }

  getAllProjects(){
    this.projectService.getProjects().subscribe(
      response => {
        console.log(response);
        this.projects = response;
      }
    )
  }
  getTypesProjects(){
    this.typeProjectService.getTypes().subscribe(
      response => {
        console.log(response);
        this.typesProjects = response;
      }
    )
  }

  getProjectsByType(type: TypeProject) {
    this.currentType = type
    console.log(type.id)
    this.projectService.getProjectsByType(type.id).subscribe(

      response => {
        console.log(response);
        this.projects = response;
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
