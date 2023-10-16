import { Component, ElementRef, HostListener, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { ChatService, Message } from './chat.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/api.service';
import { ThemePalette } from '@angular/material/core';
import { PDFSource, ZoomScale, PDFProgressData, PdfViewerComponent, PDFDocumentProxy } from 'ng2-pdf-viewer';
import { Observable, of } from 'rxjs';
import { LoadDataService } from 'src/app/core/load-data.service';
import { MatDialog } from '@angular/material/dialog';
import { PdfPreviewDialogComponent } from './pdf-preview-dialog/pdf-preview-dialog.component';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss']
})
export class ChatScreenComponent implements OnInit {
  load: boolean = false;
  constructor(public chatService: ChatService,
    private spinner: NgxSpinnerService,
    public apiService: ApiService,
    public dialog: MatDialog,
    private loadDataService: LoadDataService) { }
  messages: Message[] = [];
  value: string = '';
  input_string: any;
  showPDF: boolean = false;
  sample_string = "Interpretations are the full responsibility of those producing them. Neither the GRI Board of Directors, GSSB, nor Stichting Global Reporting Initiative (GRI) can assume responsibility for any consequences or damages resulting directly or indirectly from the use of the GRI Standards and related Interpretations in the preparation of reports, or the   use of reports based on the GRI Standards and related Interpretations."
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  pdfSrc: string | Uint8Array | PDFSource = '../https://stbj3z634zumnje.blob.core.windows.net/content/' + this.loadDataService.input_pdf_text.page + '?sp=r&st=2023-10-13T04:39:47Z&se=2023-10-31T12:39:47Z&spr=https&sv=2022-11-02&sr=c&sig=KjS4aPl9fHgKGxhz6w5Ji2%2B9tHsECkPY3JRFLBPwBeM%3D';
  task: Task = {
    name: 'Select All',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Primary', completed: false, color: 'primary' },
      { name: 'Accent', completed: false, color: 'accent' },
      { name: 'Warn', completed: false, color: 'warn' },
    ],
  };

  task_list: any = [];

  allComplete: any = [];
  openDialog(): void {
    let val = JSON.parse(JSON.stringify(this.loadDataService.input_pdf_text));
    let temp =
    {
      'page': '',
      'loc': 'popup',
      'text': val.text
    }
    this.loadDataService.input_pdf_text = temp;

    const dialogRef = this.dialog.open(PdfPreviewDialogComponent, {
      width: '91.1875rem',
      height: '45.875rem',
      data: {},
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }
  updateAllComplete(item: any, index: any, sub: any) {
    //this.allComplete[index] = false;
    this.allComplete[item.title] = this.task_list[index].subTask != null && this.task_list[index].subTask.every((t: any) => t.completed);
  }

  someComplete(item: any, index: any): boolean {
    if (this.task_list[index].subTask == null) {
      return false;
    }
    return this.task_list[index].subTask.filter((t: any) => t.completed).length > 0 && !this.allComplete[item.title];
  }

  setAll(completed: boolean, task: any, index: any) {

    this.allComplete[index] = completed;
    if (this.task_list[index].subTask == null) {
      return;
    }
    this.task_list[index].subTask.forEach((t: any) => (t.completed = completed));

  }


  sendMessage() {
    this.spinner.show();
    if (this.value != '') {
      this.chatService.getBotAnswer(this.value,this.messages);
      this.input_string = this.value;
      //this.showPDF = true;
      this.load = true;
      this.loadDataService.input_pdf_text = {
        'page': "",
        'loc': "chat-page",
        //text: this.value
        'text': this.sample_string
      }
      // setTimeout(() => {
      //   this.task_list = [];
      //   let data = this.chatService.response;
      //   if (data && data['facets']) {
      //     data['facets'].forEach((element: any) => {
      //       let task: any = {};
      //       task['title'] = element.title;
      //       task['subTask'] = [];
      //       element.content.forEach((ele: any) => {
      //         task['subTask'] = [...task['subTask'], { name: ele.value, completed: false, color: 'primary' }]
      //       });
      //       this.task_list.push(task);
      //     });
      //   }
      // }, 2002);
    }
    this.value = '';
  }

  scrollToBottom() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  mobile = false;

  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  ngOnInit() {
    if (window.screen.width <= 768) {
      this.mobile = true;
    }
    this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
      setTimeout(() => {
        this.scrollToBottom();
        this.spinner.hide();
      }, 1002);

    });
  }
  hidePDF() {
    this.showPDF = false;
  }
  // Load pdf
  loadPdf() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../https://stbj3z634zumnje.blob.core.windows.net/content/'+this.chatService.selectedFileName+'?sp=r&st=2023-10-13T04:39:47Z&se=2023-10-31T12:39:47Z&spr=https&sv=2022-11-02&sr=c&sig=KjS4aPl9fHgKGxhz6w5Ji2%2B9tHsECkPY3JRFLBPwBeM%3D', true);
    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: 'application/pdf' });
        this.pdfSrc = URL.createObjectURL(blob);
      }
    };

    xhr.send();
  }

  // onClick(input:any , e:MouseEvent) : void{
  //   input.helpOpen=!input.helpOpen;

  //   console.log('event element',e);
  //    if ((e.target as HTMLElement).tagName === 'A') { 
  //      let target = e.target as HTMLElement;
  //      alert(target.innerHTML)
  //    }
  // }
  onClick(optionNumber: number) {
    // Handle the click event with the selected option number
    console.log(`Button ${optionNumber} clicked.`);
    // You can perform any desired action with the selected number.
  }
  public html: string = '<a id="element-a">click a elemnt </a></span>another element</span>';

 toggleHelp(input:any , e:MouseEvent) : void{ 
  this.showPDF = false;    
    input.helpOpen=!input.helpOpen;
    console.log('event element',e);
     if ((e.target as HTMLElement).tagName === 'A') { 
       let target = e.target as HTMLElement;
       //alert(target.innerHTML)
       let num = parseInt(target.innerHTML) - 1
       //this.chatService.selectedFileName = this.chatService.dataPointList[num].fileName;
       this.showPDF = true;       
       let temp =
       {
         'page': this.chatService.dataPointList[num].fileName,
         'loc': 'chat-screen',
         'text': this.chatService.dataPointList[num].hlText
       }
       this.loadDataService.input_pdf_text = temp;
      
     }
  }
}

