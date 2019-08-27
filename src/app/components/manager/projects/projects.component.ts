import { Component, OnInit } from '@angular/core';
import {Project} from '../../../models/Project';
import {Router} from '@angular/router';
import {ProjectService} from '../../../services/projects/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  message: string;
  coinwallet: string[] = ['Projects','Utilisateurs'];
  selectedwallet = this.coinwallet[0];

  constructor(private router: Router,
              public projectService: ProjectService) { }

  ngOnInit() {
    this.getAllProjects()
  }

  getAllProjects(){
    this.projectService.getProjects().subscribe(
      response => {
        console.log(response);
        this.projects = response;
      }
    )
  }

  updateProjet(id: number) {
    
  }

  deleteProjet(id: number) {
    
  }
}
