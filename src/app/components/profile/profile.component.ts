import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../services/profiles/profile.service';
import {TypeProject} from '../../models/TypeProject';
import {User} from '../../models/User';
import {Router} from '@angular/router';
import {AuthentificationService} from '../../services/authentification.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Person} from '../../models/Person';
import {Contribution} from '../../models/Contribution';
import {ContributionService} from '../../services/contributions/contribution.service';
import {PersonService} from '../../services/persons/person.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private person: Person;
  private contributions: Contribution[];
  private progress: number = 0;
  private editPhoto: boolean;
  private disableButtonUpload: boolean=false;
  private selectedFiles;
  private currentFileUpload: any;
  private timestamp: number=0;

  public host:string="http://localhost:8082";

  coinwallet: string[] = ['Account','Projects'];
  selectedwallet = this.coinwallet[0];

  constructor(private profileService: ProfileService,
              public AuthentService: AuthentificationService,
              private toastr: ToastrService,
              private contributionservice: ContributionService,
              private personneService: PersonService) { }

  ngOnInit() {
    this.person = new Person(0,'','','','','','','','','','','','');
     this.getProfile();

  }
  getProfile() {
    let username = this.AuthentService.getUsernameConnected();
    this.profileService.getMyProfile(username).subscribe(
      response => {
        this.person = response;
        this.getContributions();
      }
    )
  }


  getContributions() {
    let idPerson = this.person.id;
    this.contributionservice.getContributions(idPerson).subscribe(
      response => {
        this.contributions = response;
      }
    )
  }




  onEditPhoto() {
    this.progress = 0;
    this.editPhoto = !this.editPhoto;
  }

  onSelectFile(event) {
    this.disableButtonUpload = true;
    this.selectedFiles = event.target.files;
  }

  uploadPhoto() {
    this.progress = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    let username = this.AuthentService.getUsernameConnected();
    this.profileService.uploadImages(this.currentFileUpload, username).subscribe(event => {
      if(event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
        console.log(this.progress);
      }else if ( event instanceof HttpResponse) {
        //alert("Photo uploaded");
        this.timestamp= Date.now();
      }
    },err => {
      alert("Probeme de chargement");
    });
  }

  getTs() {
    return this.timestamp;
  }

  displayDesc(descriptionProjet: string) {
    if(descriptionProjet.length >= 85) {
      descriptionProjet = descriptionProjet.substring(0, 82) + '...';
    }
    return descriptionProjet
  }

  saveProfile() {
    this.personneService.savePerson(this.person)
      .subscribe (
        data => { this.showToasterSaveProfile()}
        )
     }

  showToasterSaveProfile(){
    this.toastr.success("Your profile data updated successfully!")
  }
}
