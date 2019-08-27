import {TypeProject} from './TypeProject';

export class Project {
  constructor(
    public id: number,
    public nomProjet: string,
    public descriptionProjet: string,
    public delaiProjet: string,
    public dateDebut: Date,
    public natureProjet: string,
    public isCloture: boolean,
    public fondsApportes: number,
    public fondsALever: number,
    public typeProjets: any,
    public adresse: any
  )
  {

  }
}
