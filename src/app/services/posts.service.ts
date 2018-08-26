import { Injectable } from "@angular/core";
import {environment} from '../../environments/environment'
import { Http,Headers } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable()
export class PostsService
{   
    
    constructor(private http: Http) { }


    getPosts()
    {
        return this.http.get(environment.ws_url + 'posts/getposts')
        .pipe(map(res => res.json()))
        
    }

    getMyPosts(id)
    {   
        let headers = new Headers();
        headers.set("Authorization", id)
        headers.set('content-type', 'application/json')
        return this.http.get(environment.ws_url+'posts/getmyposts', {headers:headers})
        .pipe(map(res => res.json()))
    };

       getComments(id)
       {
        let headers = new Headers();
        headers.set("Authorization", id)
        headers.set('content-type', 'application/json')
        return this.http.get(environment.ws_url+'posts/getcomments', {headers:headers})
        .pipe(map(res => res.json()))
       }


      uploadPostWithImage(fd)
      {         
          return this.http.post(environment.ws_url+'posts/uploadImage', fd) 
          .pipe(map(res =>  res.json())  
    )}

    }


