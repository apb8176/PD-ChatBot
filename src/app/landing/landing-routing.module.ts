import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent,children:[
    
    { path: 'chat', loadChildren: () => import('./chat-screen/chat-screen.module').then(m => m.ChatScreenModule) }
  ] }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
