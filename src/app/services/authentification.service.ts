import {Injectable} from '@angular/core';
import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {JwtHelper} from 'angular2-jwt';
import {User} from '../models/User';
import {API_URL} from '../app.constants';

export const TOKEN = 'token'
export const AUTHENTICATED_USER = 'authenticaterUser'
export const ROLE = 'role'


@Injectable()
export class AuthentificationService{


  private jwtToken=null;
  private roles:Array<any>;
  constructor(private http: HttpClient,private router: Router){

  }
  login(user){
        return this.http.post(`${API_URL}`+"/login", user,{observe:'response'});
  }


  saveToken(jwt: string,user: User) {
    //console.log('tooooken'+ this.jwtToken)
    localStorage.setItem(TOKEN, jwt);
    localStorage.setItem(AUTHENTICATED_USER, user.username);

    this.loadToken();
    let jwtHelper = new JwtHelper();
    this.roles = jwtHelper.decodeToken(jwt).roles;
    this.getRole();
  }

  loadToken(){
    this.jwtToken = localStorage.getItem(TOKEN);
  }


  isUserLoggedIn() {
    let user = localStorage.getItem(AUTHENTICATED_USER)
    return !(user === null)
  }

  logout(){
    this.jwtToken = null;
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(AUTHENTICATED_USER);
    localStorage.removeItem(ROLE);
    this.router.navigateByUrl('');
  }


  getRole(){
    for(let r of this.roles){
      //console.log('------------------------------'+r.authority)
      if(r.authority=='ADMIN'){
        let user = localStorage.setItem(ROLE,'ADMIN')
      }

    }
  }


  isAdmin(){
    if(localStorage.getItem(ROLE)=='ADMIN'){
      return true
    }
    return false
  }

  getUsernameConnected(){
    return localStorage.getItem(AUTHENTICATED_USER)
  }


  register(user: User) {
    return this.http.post<User>(`${API_URL}`+"/register", user,{observe:'response'});
  }
}
