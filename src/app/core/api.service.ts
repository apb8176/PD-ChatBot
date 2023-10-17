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
    //let finalToken = 'Bearer ' + token;
    let finalToken = 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiJhcGk6Ly9mYTFiN2FiOS0xMGExLTRiY2ItOGM1ZC0wZGYxNGRmYmRlOGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MjA1NzY4Ni0zMTQ4LTRmM2UtYWYxOC0xZmQ3NmI3ZTMzMWYvIiwiaWF0IjoxNjk3NTU4ODM2LCJuYmYiOjE2OTc1NTg4MzYsImV4cCI6MTY5NzU2Mzg4MywiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhVQUFBQWlaYXhjWkJPRUt1dnREc1NkclZmWGdBUlpPdjZCa3A5cUk4ZkM5VlhUaHFvMDNYVnMzVzl6T3BEc2VJK3RTUDAiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiZmExYjdhYjktMTBhMS00YmNiLThjNWQtMGRmMTRkZmJkZThlIiwiYXBwaWRhY3IiOiIwIiwiZ2l2ZW5fbmFtZSI6IkFyY2hhbmEiLCJpcGFkZHIiOiIyNDA1OjIwMTpkMDM0OmRlOjRjYWY6Nzg3Zjo3MGM6NWU2NSIsIm5hbWUiOiJBcmNoYW5hIiwib2lkIjoiMWU2MzM4YWItNDExMi00MDg1LThjNGYtNmMzZWRjNWIwOTlkIiwicmgiOiIwLkFWQUFobllGWWtneFBrLXZHQl9YYTM0ekg3bDZHX3FoRU10TGpGME44VTM3M282MkFHby4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJVNThQLUVXMDRVUlo2UFdfRmZ3NTRwbkw0aVJSaHlWYVotX2U4QmE5cGxJIiwidGlkIjoiNjIwNTc2ODYtMzE0OC00ZjNlLWFmMTgtMWZkNzZiN2UzMzFmIiwidW5pcXVlX25hbWUiOiJBcmNoYW5hQHBsYW5ja3RvbmRhdGEuY29tIiwidXBuIjoiQXJjaGFuYUBwbGFuY2t0b25kYXRhLmNvbSIsInV0aSI6InFlMzdUczRuSVU2N0ZySExFT0JGQUEiLCJ2ZXIiOiIxLjAifQ.kCjtd3IfGzHCrUQN3m2O0WJoGbsuK_lDCJFTjggNlNW3nBuy0a0svJOQLnN7aLn3ggeTCOACRxzuA3V4Reb8Gnjm4m3VYHF1j1dhno1FWesTER_aNItutArsBth0IKHlroZ_QjoizOFreaKi7vwl1Izu4dGrE6SwwhOJmehTfYrBIqnxFoDOcouP68oW-9_BJ-FeQ-myWUXQSwxmNEO_POleCEqpKonoQDjrynmsU9fIlKZe4pK4IG7O7dWFr_cw1ZHuyrrDy8vJMu8BcMX9Kk5J2TKtZpn_jYBApufFxdh2iyfRAUIdoRIM0EuLO14mZqwJ791EFIzGHNaxazwsyg'
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
