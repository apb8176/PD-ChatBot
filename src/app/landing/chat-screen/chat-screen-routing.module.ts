import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatScreenComponent } from './chat-screen.component';
import { ExamplePdfViewerComponent } from 'src/app/example-pdf-viewer/example-pdf-viewer.component';

const routes: Routes = [{ path: '', component: ChatScreenComponent },
{ path: 'pdf', component: ExamplePdfViewerComponent} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatScreenRoutingModule { }
