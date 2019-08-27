import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Person} from '../../models/Person';
import {API_URL} from '../../app.constants';
import {Contribution} from '../../models/Contribution';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  constructor(private http: HttpClient) { }

  addContrib(p: Contribution) {
    return this.http.post<Contribution>(`${API_URL}`+"/contributions", p,{observe:'response'});
  }

  getContributions(idPerson: number) {
    return this.http.get<Contribution[]>(`${API_URL}`+"/personnes/"+idPerson+"/contributions/");
  }
}
