import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Person} from '../../models/Person';
import {API_URL} from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private jwtToken: string=null;

  constructor(private http: HttpClient,private router: Router) { }

  loadToken(){
    this.jwtToken = localStorage.getItem('token');
  }

  getMyProfile(username){
    if(this.jwtToken==null) this.loadToken();
    return this.http.get<Person>(`${API_URL}`+"/personnes/search/profile?username="+username/*,{headers:new HttpHeaders({'Authorization': this.jwtToken})}*/);
  }


  uploadImages(file: File,username):Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();
    formdata.append('file',file);
      const req = new HttpRequest('POST',`${API_URL}`+'/uploadPhoto/'+username,formdata,{
      reportProgress : true,
      responseType: 'text',
    });
    return this.http.request(req);
  }

}
