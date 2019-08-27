import { Injectable } from '@angular/core';
import {Person} from '../../models/Person';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  addPerson(p: Person) {
    return this.http.post<Person>(`${API_URL}`+"/personnes", p,{observe:'response'});
  }

  savePerson(p: Person) {
    return this.http.put<Person>(`${API_URL}`+"/personnes/"+p.id, p,{observe:'response'});
  }
}
