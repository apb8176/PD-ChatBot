import { Component } from '@angular/core';
import { EventMessage, InteractionStatus,EventType } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { environment } from './environments/environment.prod';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PD-ChatBot';  
  loginDisplay: any;
  private readonly _destroying$ = new Subject<void>();
  constructor(private msalBroadcastService: MsalBroadcastService,private authService: MsalService,){}
  ngOnInit() {
   // console.log(environment.production)

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: any) => {
        console.log('TOKEN_LOGIN_SUCCESS', result);
        let temp = result['payload']['accessToken'];
        let user = {
          name: result['payload']['account']['idTokenClaims']['name'],
          user_name: result['payload']['account']['idTokenClaims']['preferred_username'],
        }

        //localStorage.setItem('userToken', temp);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('accId', result['payload']['account']['homeAccountId']);
        localStorage.setItem('userId', user.user_name);
        localStorage.setItem('expTime', result['payload']['expiresOn'].toString());
        localStorage.setItem('login_hint',result['payload']['account'].idTokenClaims.login_hint);
        //this.router.navigateByUrl("main/home"); 
        localStorage.setItem('currentToken', temp);
      });

      this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        console.log('TOKEN_INPROGRESS');

        this.setLoginDisplay();
      })
    }
    setLoginDisplay() {
      this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    }
  
}
