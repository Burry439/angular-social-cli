import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from '../../../../../services/posts.service';
import { WebsocketService } from '../../../../../services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(private postService: PostsService, private webSocketService: WebsocketService,private router: Router) { }

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];



  @Input()id
  me = JSON.parse(localStorage.getItem('user'))
  comment:any
  editMode:Boolean = false
  editedComment:String

  toOtherProfile(id)
  {   
      if(id != this.me.id)
      {
        this.router.navigate(['/home/otherprofile', id])
      }
      else
      {
        this.router.navigate(['/home/profile'])
      }
    
  }



  delete()
  {
     this.webSocketService.deleteComment(this.id)
  }

  editComment()
  {
    this.editMode = !this.editMode
  }

  confirmEdit()
  { 
    let commentInfo = 
    {
      id:this.comment._id,
      comment:this.editedComment
    }
    this.webSocketService.editComment(commentInfo)
  }

  ngOnInit() {

    this.postService.getComments(this.id).subscribe((comment)=>{
      this.comment = comment
      
    })


      this.webSocketService.socket.on('edited-comment',(comment)=>{
        if(this.id == comment._id)
        { 
          this.comment.comment = comment.comment
        }
      })

  }

}
