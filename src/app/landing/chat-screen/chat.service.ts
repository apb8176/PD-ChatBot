import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/api.service';
import { threeQnResponse } from "src/app/models/sampleJSON";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export class Message {
  constructor(public author: string, public content: string,) { }
}

@Injectable()
export class ChatService {
  history : any = [];
  currentChat : any = {
    "user":'',
    "bot":'',
  }
  audioFile = new Audio(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3"
  );
  response: any;
  public dataPointList: any = [];  
  public selectedFileName: string = '';
  constructor(private spinner: NgxSpinnerService, public apiService: ApiService,private sanitizer: DomSanitizer) { }

  conversation = new Subject<Message[]>();

  messageMap: any = {
    Hi: "Hello",
    "Who are you": "My name is Agular Bot",
    "What is Angular": "Angular is the best framework ever",
    default: "I can't understand. Can you please repeat"
  };

  getBotAnswer(msg: string,msgs:any) {
    const userMessage = new Message("user", msg);
    this.conversation.next([userMessage]);
    this.spinner.show();
    this.currentChat.user = msg;
    setTimeout(() => {      
      this.apiService.postQuery(msg).then((response) => {
        this.spinner.hide();
        if (response) {
          this.currentChat.bot = response.answer;
          
          if(localStorage.getItem('history')){
            let item:any = localStorage.getItem('history');
            let arr = JSON.parse(item);
            this.history.push(arr[0]);
            this.history.push(this.currentChat);
            localStorage.setItem('history',JSON.stringify(this.history));
          }
          else{
            let emp:any = []
            emp.push(this.currentChat);            
            localStorage.setItem('history',JSON.stringify(emp));
          }    

          let res:any = this.findDataPoints(response);
          // const botMessage = new Message("bot", this.response);
          const botMessage = new Message("bot", res);

          //   this.playFile();

          this.conversation.next([botMessage]);
          this.response = response;
          this.spinner.hide();

          return (response.answer)
          
        }
        else {
          return ("Some thing went wrong")
        }
        }).catch(
        (err: any) => {
          this.spinner.hide();
        });
        this.response = threeQnResponse;
      return(this.response)
      
    }, 500);
  }

  playFile() {
    this.audioFile.play();
  }

  playAudio() {
    //this.playFile("https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3");
    //this.playFile("https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3");

  }

  // sendQuery(data: any) {
  //   this.spinner.show();
  //   this.apiService.postQuery(data).then((response) => {
  //     this.spinner.hide();
  //     if (response) {
  //       this.response = response.answer;
  //       return (response.answer)

  //     }
  //     else {
  //       return ("Some thing went wrong")
  //     }
  //   }).catch(
  //     (err: any) => {
  //       this.spinner.hide();
  //     });
  // }

  findDataPoints(res:any){
    //let fileNames = Object.keys(res.data_points);
    let tempVar = JSON.parse(JSON.stringify(res));
    let counter = 1;
    let replacedText = tempVar.answer;
    this.dataPointList = [];
    res.data_points.forEach((name:any,index:any) => { 
          let fname = this.sliceStringAtColon(name);
          let hText = this.sliceStringAfterColon(name)

          let fltr = this.dataPointList.filter((item: any)=>item.fileName == fname)
          if(fltr.length){          
          }
          else{
            this.dataPointList.push({fileName:fname,hlText:hText});            
          }
          this.dataPointList.forEach((item: any,index:any)=>{
            item.fileName == fname ? counter = index+1 : '';
          })
          //counter = this.dataPointList.indexOf(fname) + 1;
          console.log('this.dataPointList--------------',this.dataPointList );
          replacedText = replacedText.replaceAll(('['+fname+']'), ('<'+counter+'>'))
          console.log('replacedText ++++++++++++++++++++++ ',replacedText );
          
       // }        
    });
    replacedText = this.replacePlaceholdersWithButtons(replacedText);
    replacedText = replacedText.replaceAll(/\n/g, '<br/>')
    console.log('============',replacedText );
    
    replacedText = this.sanitizer.bypassSecurityTrustHtml(replacedText);
    return replacedText;

  }
  sliceStringAtColon(inputString: string): string {
    const colonIndex = inputString.indexOf(':');
    if (colonIndex !== -1) {
      return inputString.slice(0, colonIndex);
    } else {
      return inputString;
    }
  }
  sliceStringAfterColon(inputString: string): string{
    const colonIndex = inputString.indexOf(':');
    if (colonIndex !== -1) {
      const substringAfterColon = inputString.slice(colonIndex + 1).trim();
      const words = substringAfterColon.split(/\s+/).slice(0, 10); // Get the first 10 words.
      return words.join(' ');
    } else {
      return ""; // Return an empty string if there is no colon in the input.
    }
  }
  replaceAllStr(input: string, search: string, replacement: string): string {
    
    if (!input || !search || !replacement) {
      return input;
    }

    return input.replace(new RegExp(search, 'g'), replacement);
  }

  // replacePlaceholdersWithButtons(text: string): string {
  //   // Use a regular expression to find and replace all instances of <number> with buttons
  //   return text.replace(/<(\d+)>/g, (match, number) => {
  //     return `<a style="color:blue" id="element-${number}" (click)="onClick(${number})">${number}</a>`;
  //   });
  // }

  // onClick(optionNumber: number) {
  //   // Handle the click event with the selected option number
  //   console.log(`Button ${optionNumber} clicked.`);
  //   // You can perform any desired action with the selected number.
  // }
  replacePlaceholdersWithButtons(text: string): any {
    // Use regular expressions to find and replace <1> and <2> with buttons
    return text.replace(/<(\d+)>/g, (match, number) => {
          return `<a style="color:blue; height:5px; width:5px; border:0.5px solid #b3b3db; border-radius:5px; font-weight:600; font-size:11px;padding-right: 5px;padding-left: 5px; background-color:#F0F8FF; cursor:pointer;margin:2px" id="element-${number}">${number}</a>`;
    });

    // Use DomSanitizer to mark the HTML content as safe
    //return this.sanitizer.bypassSecurityTrustHtml(finalText);
  }

  
}
