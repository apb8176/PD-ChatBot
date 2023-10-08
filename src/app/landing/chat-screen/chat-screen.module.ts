import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatScreenRoutingModule } from './chat-screen-routing.module';
import { ChatScreenComponent } from './chat-screen.component';
import { ChatService } from './chat.service';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ExamplePdfViewerComponent } from 'src/app/example-pdf-viewer/example-pdf-viewer.component';

import { MatSelectModule } from "@angular/material/select";
import { PdfViewerModule } from 'src/app/pdf-viewer/pdf-viewer.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ChatScreenComponent,
    ExamplePdfViewerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ChatScreenRoutingModule,
    NgxSpinnerModule,
    MatExpansionModule,
    MatCheckboxModule,    
    MatSelectModule,
    PdfViewerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    PdfViewerModule,
    ReactiveFormsModule
  ],
    
  
  providers: [ChatService]
})
export class ChatScreenModule { }
