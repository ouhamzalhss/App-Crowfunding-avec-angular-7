import { Component, OnInit } from '@angular/core';
//import * as $ from 'jquery';
declare var $:any;
import {AuthentificationService} from '../../services/authentification.service';
import {Router} from '@angular/router';
import {User} from '../../models/User';
import {ToastrService} from 'ngx-toastr';
import {PersonService} from '../../services/persons/person.service';
import {Person} from '../../models/Person';
import {ProfileService} from '../../services/profiles/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private mode: number=0;
  user: User;
  usernameConnecte: string='';
  messageError: string='';
  person: Person;
  public host:string="http://localhost:8082";
  constructor(public authService: AuthentificationService,
              private router: Router,
              private toastr: ToastrService,
              private personService: PersonService,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.user = new User(0,'','','','','','','','','');
    this.person = new Person(0,'','','','','','','','','','','','');

    this.getProfile();
  }

  // Register Model
  showRegisterModal():void {
    $("#myModal").modal('show');
    this.hideLoginModal();
  }
  sendRegisterModal(): void {
    //do something here
    this.hideRegisterModal();
  }
  hideRegisterModal():void {
    document.getElementById('close-modal').click();
  }

  // Login Model
  showLoginModal():void {
    $("#myModal").modal('show');
    this.hideRegisterModal();
  }
  sendLoginModal(): void {
    //do something here
    this.hideLoginModal();
  }

  hideLoginModal():void {
    console.log('closed')
    document.getElementById('close-modal2').click();
  }
  showToaster(){
    this.toastr.error("Hi, You must connected.")
  }
  showToasterLogin(){
    this.toastr.success("Welcome to our plateforme.")
  }

  onLogin(user) {
      this.authService.login(user).subscribe(res=>{
      let jwt = res.headers.get('Authorization');
      //console.log(jwt);
      this.usernameConnecte = user.username;
      this.hideLoginModal();
      this.showToasterLogin();
      this.authService.saveToken(jwt,user);
      this.getProfile();
    },error1 => {
      this.mode=1;
    })
  }

   userToPerson(user: User): Person{
    this.person=<Person>this.user
    return this.person;
  }

  onRegister() {
        this.authService.register(this.user)
        .subscribe (
          data => {

            this.personService.addPerson(this.userToPerson(this.user)).subscribe(
              data=> {}
            )

            this.onLogin({"username":this.user.username,"password":this.user.password})
            this.hideRegisterModal();
          },error1 => {
            this.messageError= error1.error.message;
          }
        )
  }
  getProfile() {
    let username = this.authService.getUsernameConnected();
    this.profileService.getMyProfile(username).subscribe(
      response => {
        console.log(response);
        this.person = response;
      }
    )
  }

}
