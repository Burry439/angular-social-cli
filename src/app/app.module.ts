
/////modules///////////
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router'
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';
////////////////////////

///ngbootstrap modules//
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
///////////////////////////////////////


/////////////ngPrime Modules////////////
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {GrowlModule} from 'primeng/growl';
import {DialogModule} from 'primeng/dialog';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

/////////////////////////////////////////



//////////components/////////////////
import { AppComponent } from './app.component';
import { ChatComponent } from './components/main/chat/chat.component'
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/main/home.component';
import { NavbarComponent } from './components/main/navbar/navbar.component';
import { MessageComponent } from './components/main/message/message.component';
import { ProfileComponent } from './components/main/profile/profile.component';
import {  DashboardComponent } from './components/main/dashboard/dashboard.component';
import { AddPostComponent } from './components/main/dashboard/add-post/add-post.component';
import { PostComponent } from './components/main/dashboard/post/post.component'
import { OtherProfileComponent } from './components/main/other-profile/other-profile.component';

//////////////////////////


//////////////services////////////////
import {WebsocketService} from './services/websocket.service';
import { AuthService } from './services/auth.service'
import { GaurdService } from  './services/gaurd.service';
import {MessageService} from 'primeng/components/common/messageservice';
import {ChatService} from './services/chat.service'
import {PostsService} from './services/posts.service';
import { CommentsComponent } from './components/main/dashboard/post/comments/comments.component';
import { AntiGaurdService } from './services/antiGaurd.service';


/////////////////////////////////










const appRoutes = [
  {path: '', redirectTo:'home/dashboard', pathMatch:'full'}, 
  {path: 'login', component: LoginComponent, canActivate:[AntiGaurdService]},
  {path: 'home', component: HomeComponent, 
  canActivate:[GaurdService],
  children:[
    {path: 'profile', component: ProfileComponent, canActivate:[GaurdService]},
    {path: 'otherprofile/:id', component: OtherProfileComponent, canActivate:[GaurdService]},
    {path: 'dashboard', component: DashboardComponent, canActivate:[GaurdService]},  
  
  ]},  

]


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    NavbarComponent,
    MessageComponent,
    ProfileComponent,
    DashboardComponent,
    AddPostComponent,
    PostComponent,
    CommentsComponent,
    OtherProfileComponent,
  ],
  imports: [
    ButtonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    GrowlModule,
    ScrollPanelModule,
    BrowserAnimationsModule,
    NgbModule,
    SidebarModule,
    DialogModule,
    AngularFontAwesomeModule,

    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
   CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'dude439'})


  ],
  providers: [WebsocketService,AuthService,GaurdService,AntiGaurdService ,MessageService,ChatService,PostsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
