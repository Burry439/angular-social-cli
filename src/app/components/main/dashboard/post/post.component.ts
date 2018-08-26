import { Component, OnInit, Input,Output,EventEmitter, HostListener } from '@angular/core';
import { WebsocketService } from '../../../../services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  me = JSON.parse(localStorage.getItem('user'))
  editMode:boolean = false
  postEdit:String = ''
  showComments:Boolean
  @Input()post
  @Input()from
  @Input()image
  @Input()id
  @Input()comments
  @Input()time
  @Input()to
  @Output() delete:EventEmitter<any> = new EventEmitter()
  @Output() edit:EventEmitter<any> = new EventEmitter()
  @Output() gotAComment:EventEmitter<any> = new EventEmitter()
  @Output() updatedProfilePic:EventEmitter<any> = new EventEmitter()
  comment:String
  display: boolean = false;
  dialogImage:String = '' ;
  dialogImageSize:Number = 500
  innerWidth:Number;
  constructor(private webSocketService: WebsocketService, private router: Router) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
  this.innerWidth = window.innerWidth;


      if(this.innerWidth < 478)
      {
        this.dialogImageSize = 300
      }
  }



playSound()
{
  let audio = new Audio();
  audio.src = "../assets/sounds/seen.mp3";
  audio.loop = false
  audio.load();
  audio.play();
}



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


  showDialog(image) {
    this.dialogImage = image
    this.display = true;
}




  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  editPost()
  {
    this.editMode = true
  }

  confirmEdit()
  { 
    this.editMode = false
    this.edit.emit(this.postEdit)
    this.postEdit = ''
  }

  deletePost()
  {
      this.delete.emit()
  }

  addComment()
  {   

    let currentdate = new Date(); 
    let datetime = 
    {
       month: this.months[(currentdate.getMonth()+1)] ,
       date: currentdate.getDate() ,            
       year: currentdate.getFullYear() ,  
       hour: currentdate.getHours() ,  
       minute: currentdate.getMinutes()
    }

      let commentInfo = 
      {
        postId:this.id,
        from:this.me.id,
        comment:this.comment,
        time:datetime,
        firstname: this.me.firstname,
        lastname: this.me.lastname
      }
      this.comment = ''
      this.playSound()
      this.webSocketService.addComment(commentInfo)
  }
  
  ngOnInit() {


    this.innerWidth = window.innerWidth;


    this.webSocketService.socket.on('new-comment',(comment,from, postId, firstname,lastname)=>{
        this.comments = comment.comments
    })


    this.webSocketService.socket.on('deleted-comment',(comment)=>{

        for(let i = 0; i < this.comments.length; i++)
        {
          if(this.comments[i] == comment._id)
          { 
            this.comments.splice(i,1)
          }
        }
    })


    



  }

}
