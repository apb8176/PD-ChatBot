import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient,private spinner: NgxSpinnerService) { }

  postQuery(data: any): Promise<any> {
    //this.cmnService.tokenRefresh();
    console.log('--------->',data);
    let history:any = [];
    if(localStorage.getItem('history')){
      let item = localStorage.getItem('history') || '{}';
      history = JSON.parse(item);
      history.push({user:data});
    }
    else{
      history.push({user:data});
    }  
    console.log('History of the chat-----:----------',history);
    
    this.spinner.show();
    let token = localStorage.getItem('currentToken');
    let finalToken = 'Bearer ' + token;
    console.log('token--',finalToken);
    
    let header = {
      headers: new HttpHeaders({
        "Accept":"*/*",
        "Authorization":finalToken,
        "Accept-Language":"en-US,en;q=0.9",
        "Content-Type":"application/json",

        
     })}

    data={
      "history": history,
      "approach": "rrr",
      "overrides": {
          "retrieval_mode": "hybrid",
          "semantic_ranker": true,
          "semantic_captions": false,
          "top": 3,
          "suggest_followup_questions": false
      }
  }
    const url = 'https://app-backend-bj3z634zumnje.azurewebsites.net/chat';   
    return new Promise((resolve, reject) => {
      this._http.post(url,data,header).subscribe({
        next: (response: any) => { 
          console.log("Msg", response);  
          this.spinner.hide();     
          resolve(response);
        },
        error: (error) => {
          console.log("Error",error);
          this.spinner.hide();
          reject(error.message);
        }
      })
    });
  }
}
