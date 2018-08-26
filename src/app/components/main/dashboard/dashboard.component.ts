import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { WebsocketService } from '../../../services/websocket.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  posts:any[] = []
  me = JSON.parse(localStorage.getItem('user'))
  constructor(private postsService:PostsService, private webSocketService: WebsocketService, private messageService: MessageService) { }


  
playSound()
{
  let audio = new Audio();
  audio.src = "../assets/sounds/notification.mp3";
  audio.loop = false
  audio.load();
  audio.play();
}




     deletePost(id)
    {   
        this.webSocketService.deletePost(id)
    }

    editPost(edit, id)
    {   

        let postInfo =
        {
          post:edit,
          _id:id
        }

       this.webSocketService.editPost(postInfo)
    }

  ngOnInit() {


    this.webSocketService.socket.on('new-post', (post)=>{
      this.posts.unshift(post)
    })

    this.webSocketService.socket.on('deleted-post', (post)=>{
      
        for(let i = 0; i < this.posts.length; i++)
        {
          if(this.posts[i]._id == post._id)
          {
            this.posts.splice(i,1)
          }
        }
    })


    this.webSocketService.socket.on('edited-post', (post)=>{
      
      for(let i = 0; i < this.posts.length; i++)
      {
        if(this.posts[i]._id == post._id)
        { 
          this.posts[i].post = post.post
        }
      }
  })

    this.postsService.getPosts().subscribe((res)=>{
      this.posts = res
    })


    this.webSocketService.socket.on('new-profilePic', (profilePic,id)=>{

      let firstname = ''
      let lastname = ''


      for(let i = 0; i < this.posts.length; i++)
      {
        if(this.posts[i].from._id == id)
        {
          this.posts[i].from.profilePic = profilePic
          firstname = this.posts[i].from.firstname
          lastname = this.posts[i].from.lastname
        }
      }
})


  }

}
