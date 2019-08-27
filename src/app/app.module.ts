import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { HelpComponent } from './components/help/help.component';
import { ContactComponent } from './components/contact/contact.component';
import { AllProjectsComponent } from './components/all-projects/all-projects.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import {HttpClientModule} from '@angular/common/http';
import {ProjectService} from './services/projects/project.service';
import {TypeService} from './services/typesProjects/type.service';
import {FormsModule} from '@angular/forms';
import {AuthentificationService} from './services/authentification.service';
import { ProfileComponent } from './components/profile/profile.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import { ProjectsComponent } from './components/manager/projects/projects.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
    ProjectDetailComponent,
    HelpComponent,
    ContactComponent,
    AllProjectsComponent,
    NewProjectComponent,
    ProfileComponent,
    FileUploadComponent,
    ProjectsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [ProjectService,TypeService,AuthentificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
