import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class OtherprofileService {

  constructor(private http: Http) { }





  getOtherProfile(id):Observable<any>
  { 
 
    let headers = new Headers();
    headers.set("Authorization", id)
    headers.set('content-type', 'application/json')
    return this.http.get(environment.ws_url+'users/otherprofile', {headers:headers})
    .pipe(map(res => res.json()))
   };

   getOtherProfilePosts(id)
   {
        let headers = new Headers();
        headers.set("Authorization", id)
        headers.set('content-type', 'application/json')
        return this.http.get(environment.ws_url+'posts/getotherposts', {headers:headers})
        .pipe(map(res => res.json()))
    
   }
   

}
