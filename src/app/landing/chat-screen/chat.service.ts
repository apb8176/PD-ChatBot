import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/api.service';

export class Message {
  constructor(public author: string, public content: string) { }
}

@Injectable()
export class ChatService {
  audioFile = new Audio(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3"
  );
  response: any;
  constructor(private spinner: NgxSpinnerService, public apiService: ApiService) { }

  conversation = new Subject<Message[]>();

  messageMap: any = {
    Hi: "Hello",
    "Who are you": "My name is Agular Bot",
    "What is Angular": "Angular is the best framework ever",
    default: "I can't understand. Can you please repeat"
  };

  getBotAnswer(msg: string) {
    const userMessage = new Message("user", msg);
    this.conversation.next([userMessage]);
    
    setTimeout(() => {
      this.apiService.postQuery('').then((response) => {
        this.spinner.hide();
        if (response) {
          
          // const botMessage = new Message("bot", this.response);
          const botMessage = new Message("bot", response.data.answer);

          //   this.playFile();
          this.conversation.next([botMessage]);
          this.response = response.data;
          return (response.data.answer)
          
        }
        else {
          return ("Some thing went wrong")
        }
        }).catch(
        (err: any) => {
          this.spinner.hide();
        });
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

  sendQuery(data: any) {
    this.spinner.show();
    this.apiService.postQuery(data).then((response) => {
      this.spinner.hide();
      if (response) {
        this.response = response.answer;
        return (response.answer)

      }
      else {
        return ("Some thing went wrong")
      }
    }).catch(
      (err: any) => {
        this.spinner.hide();
      });
  }
}
