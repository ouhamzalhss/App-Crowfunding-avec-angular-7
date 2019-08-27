import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {API_URL} from '../../app.constants';
import {TypeProject} from '../../models/TypeProject';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  private jwtToken: string=null;

  constructor(private http: HttpClient) { }

  loadToken(){
    this.jwtToken = localStorage.getItem('token');
  }

  getTypes() {
    //if(this.jwtToken==null) this.loadToken();
    //return this.http.get<TypeProject[]>(`${API_URL}/typesProjects`,{headers:new HttpHeaders({'Authorization': this.jwtToken})});
    return this.http.get<TypeProject[]>(`${API_URL}/typesProjects`);
  }
}
