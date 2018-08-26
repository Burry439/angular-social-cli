import { Component, OnInit } from '@angular/core';
import { MessageService } from 'node_modules/primeng/components/common/messageservice';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent implements OnInit {


  constructor(private messageService: MessageService, private webSocketService: WebsocketService) { }

  me = JSON.parse(localStorage.getItem('user'))



  playSound()
  {
    let audio = new Audio();
    audio.src = "../assets/sounds/notification.mp3";
    audio.loop = false
    audio.load();
    audio.play();
  }

  ngOnInit() {


      setTimeout(() => {
        
          
      this.webSocketService.socket.on('new-post', (post)=>{

          console.log("messaeg inside component")

        if(post.from._id != this.me.id && post.to != undefined && post.to._id == this.me.id)
        { 
          this.messageService.add({severity:'success', summary:'New Post', detail:post.from.firstname + " "+ post.from.lastname + " wrote on  your wall"});
          this.playSound()
        }

        else if (post.from._id != this.me.id && post.to != undefined)
        { 
          this.messageService.add({severity:'success', summary:'New Post', detail:post.from.firstname + " "+ post.from.lastname + " wrote on  " + post.to.firstname + " "+ post.to.lastname +'s wall'});
          this.playSound()
        }

        else if(post.from._id != this.me.id)
        { 
          this.messageService.add({severity:'success', summary:'New Post', detail:post.from.firstname + " "+ post.from.lastname + " added a new post: " + post.post});
          this.playSound()
        }


      })
  
  
      this.webSocketService.socket.on('new-comment',(post,comment, commentInfoFrom, commentInfoPostId, firstname,lastname)=>{

          console.log("messaeg inside component")


          if(post.from == this.me.id && commentInfoFrom != this.me.id )
          { 
             this.messageService.add({severity:'success', summary:'New comment', detail:firstname + " "+ lastname + " commented on " + post.post});
             this.playSound()
         }
         else if(post.to != undefined && post.to == this.me.id && commentInfoFrom != this.me.id )
         { 
            this.messageService.add({severity:'success', summary:'New comment', detail:firstname + " "+ lastname + " commented on a post on your wall " + post.post});
            this.playSound()
        }
      })
  
  
    this.webSocketService.socket.on('new-profilePic', (profilePic,id, firstname, lastname)=>{
      if(id != this.me.id)
      {
          this.playSound()
         this.messageService.add({severity:'success', summary:'Updated Profile Picture ', detail:firstname + " "+ lastname + " Updated there Profile Picture"});
      }
  
  })

  this.webSocketService.socket.on('new-wallPic', (wallPic,id, firstname, lastname)=>{
    if(id != this.me.id)
    {
        this.playSound()
       this.messageService.add({severity:'success', summary:'Updated Wall Picture ', detail:firstname + " "+ lastname + " Updated there Wall Picture"});
    }

})



        
      }, 500);


    






  }

}
