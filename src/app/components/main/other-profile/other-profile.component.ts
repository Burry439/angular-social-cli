import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OtherprofileService } from '../../../services/otherprofile.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { WebsocketService } from '../../../services/websocket.service';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.css']
})
export class OtherProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute,
     private otherService: OtherprofileService,
      private webSocketService: WebsocketService,
      private postService: PostsService  
    ) { }

  display: boolean = false;
  dialogImage:String = '' ;
  dialogImageSize:Number = 500
  innerWidth:Number;
  me = JSON.parse(localStorage.getItem('user'))
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  post:String  
  profile:any
  posts:any[] = []
    ///pic vars


    picture:any
    tempPicture:any
    imageSelected:Boolean = false
    imgPost:String
    /////////////////

  @HostListener('window:resize', ['$event'])
  onResize(event) {
  this.innerWidth = window.innerWidth;


      if(this.innerWidth < 478)
      {
        this.dialogImageSize = 300
      }
  }





onPictureSelected(event)
{
  this.picture = <File>event.target.files[0]
  if (event.target.files && event.target.files[0]) 
  {
     var reader = new FileReader();
     reader.onload = (event:any) => 
     {   

         this.imageSelected = true
        // this.picture = event.target.result
         this.tempPicture = event.target.result;
     }
     reader.readAsDataURL(event.target.files[0]);
 }  
}



uploadPicture()
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



  let postInfo =
  {  
     from:this.me.id,
     to: this.profile._id,
     post:this.imgPost,
     time: datetime,
  }


   const fd = new FormData


      fd.append("Pic", this.picture, this.picture.name)
      fd.append("from", JSON.stringify(postInfo))
      this.imageSelected = false;




   let post = JSON.stringify(postInfo)


   this.postService.uploadPostWithImage(fd)
   .subscribe(res =>{
    this.webSocketService.postWithPhoto(res)
  },)
}


cancelPictureChange()
{     
    this.imageSelected = false
    this.picture = null
}



  addpost()
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


    let postInfo =
    {
      from:this.me.id,
      to:this.profile._id,
      post:this.post,
      image: '',
      time: datetime
    }
    this.playSound()


    this.webSocketService.addPost(postInfo)
    this.post = ""
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



  showDialog(image) {
    this.dialogImage = image
    this.display = true;
}


playSound()
{
  let audio = new Audio();
  audio.src = "../assets/sounds/notification.mp3";
  audio.loop = false
  audio.load();
  audio.play();
}





  ngOnInit() {

    this.innerWidth = window.innerWidth;


    
    this.route.params.subscribe(id => {


      this.otherService.getOtherProfile(id.id).subscribe((res)=>{
            this.profile = res
          this.otherService.getOtherProfilePosts(id.id).subscribe((res)=>{
            this.posts = res
          })
      })
   });




   this.webSocketService.socket.on('new-profilePic', (profilePic,id)=>{
      if(id == this.profile._id)
      { 
        this.profile.profilePic = profilePic
        for(let i = 0; i < this.posts.length; i++)
        {
            this.posts[i].from.profilePic = profilePic
        }
      }
    
  })


  this.webSocketService.socket.on('new-wallPic', (wallPic,id)=>{

      if(id == this.profile._id)
      { 
        this.profile.wallPic = wallPic
     
      }
    
  })

  this.webSocketService.socket.on('new-post', (post)=>{

      if(post.from._id == this.profile._id || post.to._id == this.profile._id)
      {          
          this.posts.unshift(post)
      }
    
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



  }




}
