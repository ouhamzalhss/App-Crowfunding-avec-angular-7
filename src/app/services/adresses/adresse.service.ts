import { Injectable } from '@angular/core';
import {API_URL} from '../../app.constants';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Project} from '../../models/Project';
import {Adresse} from '../../models/Adresse';
//import {Adresse} from '../../models/Adresse';

@Injectable({
  providedIn: 'root'
})
export class AdresseService {

  constructor(private http: HttpClient,public router: Router) { }

  getAdresses() {
    //if(this.jwtToken==null) this.loadToken();
    //return this.http.get<TypeProject[]>(`${API_URL}/typesProjects`,{headers:new HttpHeaders({'Authorization': this.jwtToken})});
    return this.http.get<any>(`${API_URL}/adresses`);
  }

  addAdresse(adresse: Adresse) {
    return this.http.post<Adresse>(`${API_URL}`+"/adresses" , adresse);
  }
}
