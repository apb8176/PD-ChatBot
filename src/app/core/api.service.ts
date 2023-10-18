import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
msalConfig = {
    auth: {
      redirectUri: environment.redirectUri,
      clientId: environment.clientId,
      authority: environment.authority,
      scope: environment.scope,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    }
  };
  msalInstance = new PublicClientApplication(this.msalConfig);

  activeAccount = this.msalInstance.getAllAccounts();
  currentAccount = this.activeAccount[0];
  silentRequest = {
    scopes: [environment.scope],
    account: this.currentAccount,
    forceRefresh: false
  };

  request = {
    scopes:[environment.scope],
    loginHint: this.currentAccount.username // For v1 endpoints, use upn from idToken claims
  };
  
  constructor(private _http: HttpClient, private spinner: NgxSpinnerService) {
    
  }
  // aquireToken() {
  //   const msalConfig = {
  //     auth: {
  //       redirectUri: environment.redirectUri,
  //       clientId: environment.clientId,
  //       authority: environment.authority,
  //       scope: environment.scope,
  //     },
  //     cache: {
  //       cacheLocation: "localStorage",
  //       storeAuthStateInCookie: false,
  //     }
  //   };
  //   const msalInstance = new PublicClientApplication(msalConfig);

  //   const activeAccount = msalInstance.getAllAccounts();
  //   var currentAccount = activeAccount[0];
  //   var silentRequest = {
  //     scopes: [environment.scope],
  //     account: currentAccount,
  //     forceRefresh: false
  //   };

  //   var request = {
  //     scopes: ["Mail.Read"],
  //     loginHint: currentAccount.username // For v1 endpoints, use upn from idToken claims
  //   };

  //   msalInstance.acquireTokenSilent(silentRequest).then((response) => {
  //     console.log('Response', response);

  //   }).
  //     catch(async (error: any) => {
  //       if (error instanceof InteractionRequiredAuthError) {
  //         // fallback to interaction when silent call fails
  //         return msalInstance.acquireTokenRedirect(request)
  //       }
  //       else {
  //         return;
  //       }
  //     });
  // }

  // postQuery(data: any): Promise<any> {
  //   let history: any = [];
  //   if (localStorage.getItem('history')) {
  //     let item = localStorage.getItem('history') || '{}';
  //     history = JSON.parse(item);
  //     history.push({ user: data });
  //   }
  //   else {
  //     history.push({ user: data });
  //   }
  //   this.spinner.show();
  //   let token = localStorage.getItem('currentToken');
  //   let finalToken = 'Bearer ' + token;
  //   console.log('token--', finalToken);

  //   let header = {
  //     headers: new HttpHeaders({
  //       "Accept": "*/*",
  //       "Authorization": finalToken,
  //       "Accept-Language": "en-US,en;q=0.9",
  //       "Content-Type": "application/json",


  //     })
  //   }

  //   data = {
  //     "history": history,
  //     "approach": "rrr",
  //     "overrides": {
  //       "retrieval_mode": "hybrid",
  //       "semantic_ranker": true,
  //       "semantic_captions": false,
  //       "top": 3,
  //       "suggest_followup_questions": false
  //     }
  //   }
  //   const url = 'https://app-backend-bj3z634zumnje.azurewebsites.net/chat';
  //   return new Promise((resolve, reject) => {
  //     this._http.post(url, data, header).subscribe({
  //       next: (response: any) => {
  //         console.log("Msg", response);
  //         this.spinner.hide();
  //         resolve(response);
  //       },
  //       error: (error) => {
  //         console.log("Error", error);
  //         this.spinner.hide();
  //         reject(error.message);
  //       }
  //     })
  //   });
  // }

  acquireToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {    
      await this.msalInstance.initialize();
      await this.msalInstance.handleRedirectPromise();
      await this.msalInstance.acquireTokenSilent(this.silentRequest).then((response) => {
        console.log('Token Acquired:', response);
        localStorage.setItem('currentToken',response.accessToken)
        resolve(response.accessToken); // Resolve the Promise with the access token.
      }).catch(async (error: any) => {
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return this.msalInstance.acquireTokenRedirect(this.request);
        } else {
          console.log("Token acquisition failed.1",error.message);
          reject("Token acquisition error");
        }
      });
    });
  }
  postQuery(data: any): Promise<any> {
  return this.acquireToken() // Call acquireToken() to get the token.
    .then((token) => {
      if (token) {
        let history: any = [];
        if (localStorage.getItem('history')) {
          let item = localStorage.getItem('history') || '{}';
          history = JSON.parse(item);
          history.push({ user: data });
        } else {
          history.push({ user: data });
        }
        this.spinner.show();
        let token = localStorage.getItem('currentToken')
        let finalToken = 'Bearer ' + token;
        console.log('token--', finalToken);

        let header = {
          headers: new HttpHeaders({
            "Accept": "*/*",
            "Authorization": finalToken,
            "Accept-Language": "en-US,en;q=0.9",
            "Content-Type": "application/json",
          })
        };

        data = {
          "history": history,
          "approach": "rrr",
          "overrides": {
            "retrieval_mode": "hybrid",
            "semantic_ranker": true,
            "semantic_captions": false,
            "top": 3,
            "suggest_followup_questions": false
          }
        };
        const url = 'https://app-backend-bj3z634zumnje.azurewebsites.net/chat';
        return new Promise((resolve, reject) => {
          this._http.post(url, data, header).subscribe({
            next: (response: any) => {
              console.log("Msg", response);
              this.spinner.hide();
              resolve(response);
            },
            error: (error) => {
              console.log("Error", error);
              this.spinner.hide();
              reject(error.message);
            }
          });
        });
      } else {
        console.log("Token acquisition failed.");
        window.alert("Token Expired")
        return Promise.reject("Token acquisition failed.2");
      }
    });
}
}
