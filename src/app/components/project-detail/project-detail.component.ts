import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../models/Project';
import {ProjectService} from '../../services/projects/project.service';
import {Contribution} from '../../models/Contribution';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  id:number
  project: Project;
  contributions:Contribution[];
  montantTotalInv:any=0;
  const:string="_embedded.contributions";
  constructor(private route: ActivatedRoute,private projectService: ProjectService) { }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    this.project = new Project(null,'','','',new Date(),'',false,0,0,0,0);

    if(this.id) {
      this.projectService.getOneProject(this.id)
        .subscribe (
          data => this.project = data
        )
    }
  }


}
