import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
    mobile = false;
    user_Name:any;
    constructor(router:Router){
       
    }
    ngOnInit() {
      if (window.screen.width <= 768) {
        this.mobile = true;
      }
    }
}
