import { Component, OnInit } from '@angular/core';
import {Project} from '../../models/Project';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../services/projects/project.service';
import {TypeProject} from '../../models/TypeProject';
import {TypeService} from '../../services/typesProjects/type.service';
import {AdresseService} from '../../services/adresses/adresse.service';
import {AuthentificationService} from '../../services/authentification.service';
import {ProfileService} from '../../services/profiles/profile.service';
import {User} from '../../models/User';
import {Adresse} from '../../models/Adresse';
import {Contribution} from '../../models/Contribution';
import {ContributionService} from '../../services/contributions/contribution.service';
import {Person} from '../../models/Person';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  project: Project;
  typesProjects: TypeProject[]
  adresse: Adresse;
  contibution: Contribution;
  person: Person;
  idAdresse: number=0;
  private projectInserted: boolean=false;

  constructor(private router: Router,
              private projectService: ProjectService,
              private typeProjectService: TypeService,
              private adresseService: AdresseService,
              private AuthentService: AuthentificationService,
              private profileService: ProfileService,
              private contribService: ContributionService,
              private toastr: ToastrService,) { }

  ngOnInit() {
    this.adresse = new Adresse(0,'','','','','')
    this.contibution = new Contribution(0,new Date(),new Date(),0,0,0)
    this.project = new Project(null,'','','',new Date(),'',false,0,0,0,0);
    this.getTypesProjects();
    this.getProfile();
  }

    getContribution(pers: Person,proj: Project): Contribution{
      this.contibution.dateCreation = new Date();
      this.contibution.dateModification = new Date();
      this.contibution.typePersonne = 'E';
      //this.contibution.projet = 1;
      return this.contibution;
    }

  saveProject() {

        //!**************Ajout d'Adresse**************!//
        this.adresseService.addAdresse(this.adresse)
        .subscribe (
        data => {
          this.adresse=data;
          console.log("adresse inserted")
             //!********** Ajout de projet**************!//
              this.project.typeProjets="http://localhost:8082/typesProjects/"+this.project.typeProjets;
              this.project.adresse="http://localhost:8082/adresses/"+this.adresse.id;
              this.projectService.addProject(this.project)
                .subscribe (
                  data => {
                    console.log("projet inserted")
                      this.projectInserted=true;
                      this.project=data;

                    //!********** Ajout de Contribution**************!//

                    this.contibution.personne="http://localhost:8082/personnes/"+this.person.id;
                    this.contibution.projet="http://localhost:8082/projects/"+this.project.id;
                    this.contribService.addContrib(this.getContribution(this.contibution.personne,this.contibution.projet))
                      .subscribe(
                        data => {
                           this.showToaster();
                          }
                        )
                  }
                )
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


  getProfile() {
    let username = this.AuthentService.getUsernameConnected();
    this.profileService.getMyProfile(username).subscribe(
      response => {
        console.log(response);
        this.person = response;
      }
    )
  }

  showToaster(){
    this.toastr.success("Project inserted succefully.")
  }


}
