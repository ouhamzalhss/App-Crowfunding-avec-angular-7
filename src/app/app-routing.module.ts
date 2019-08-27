import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { HelpComponent } from './components/help/help.component';
import { ContactComponent } from './components/contact/contact.component';
import { AllProjectsComponent } from './components/all-projects/all-projects.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import {RouteGuardService} from './services/route-guard.service';
import {ProfileComponent} from './components/profile/profile.component';
import {ProjectsComponent} from './components/manager/projects/projects.component';


// welcome 
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'project/:id', component: ProjectDetailComponent},
  { path: 'help', component: HelpComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'profile', component: ProfileComponent, canActivate:[RouteGuardService]},
  { path: 'all-projects', component: AllProjectsComponent},
  { path: 'new-project', component: NewProjectComponent, canActivate:[RouteGuardService]},

  { path: 'manager/projects', component: ProjectsComponent, canActivate:[RouteGuardService]},

  { path: '**', component: HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
