import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService, Message } from './chat.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/api.service';
import { ThemePalette } from '@angular/material/core';
import { PDFSource, ZoomScale, PDFProgressData, PdfViewerComponent, PDFDocumentProxy } from 'ng2-pdf-viewer';
import { Observable, of } from 'rxjs';
import { LoadDataService } from 'src/app/core/load-data.service';


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
  constructor(public chatService: ChatService,
    private spinner: NgxSpinnerService,
    public apiService: ApiService,
    private loadDataService:LoadDataService) { }
  messages: Message[] = [];
  value: string ='';
  input_string : any ;
  showPDF:boolean = true;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  pdfSrc: string | Uint8Array | PDFSource = '../../../assets/pdfs/pdf-test.pdf';
  task: Task = {
    name: 'Select All',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'},
    ],
  };

  task_list : any=[];

  allComplete: any= [];

  updateAllComplete(item:any,index:any,sub:any) {
    //this.allComplete[index] = false;
    this.allComplete[item.title] = this.task_list[index].subTask != null && this.task_list[index].subTask.every((t:any) => t.completed);
  }

  someComplete(item:any,index:any): boolean {
    if (this.task_list[index].subTask == null) {
      return false;
    }
    return this.task_list[index].subTask.filter((t:any) => t.completed).length > 0 && !this.allComplete[item.title];
  }

  setAll(completed: boolean,task:any,index:any) {
    
    this.allComplete[index] = completed;
    if (this.task_list[index].subTask == null) {
      return;
    }
    this.task_list[index].subTask.forEach((t:any) => (t.completed = completed));
    
  }
 

  sendMessage() {
    this.spinner.show();
    if(this.value!=''){
      this.chatService.getBotAnswer(this.value); 
      this.input_string = this.value;    
      
      this.loadDataService.input_pdf_text = {
        page: "",
        text: this.value
      }  
      setTimeout(() => {
        this.task_list =[];
        let data = this.chatService.response;
        if(data && data['facets']){
          data['facets'].forEach((element:any) => {
             let task:any = {} ;
             task['title'] = element.title;
             task['subTask'] = [];
             element.content.forEach((ele:any) => {
                  task['subTask'] = [...task['subTask'],{name: ele.value, completed: false, color: 'primary'}]
             });  
             this.task_list.push(task);         
          });
  
        }
        this.showPDF = true;
        }, 2002);
      
    
      
    }
    this.value = '';
    //this.sendQuery({});
  }
  
  scrollToBottom() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  error: any;
  page = 1;
  rotation = 0;
  zoom = 0.4;
  zoomScale: ZoomScale = 'page-width';
  originalSize = false;
  pdf: any;
  renderText = true;
  progressData!: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  outline!: any[];
  isOutlineShown = false;
  pdfQuery = '';
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
  hidePDF(){
    
    this.showPDF = false;
  }
  // Load pdf
  loadPdf() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../../../assets/pdfs/pdf-test.pdf', true);
    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: 'application/pdf' });
        this.pdfSrc = URL.createObjectURL(blob);
      }
    };

    xhr.send();
  }

  /**
   * Set custom path to pdf worker
   */
  setCustomWorkerPath() {
    (window as any).pdfWorkerSrc = '/lib/pdfjs-dist/build/pdf.worker.js';
  }

  incrementPage(amount: number) {
    this.page += amount;
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($pdf.files[0]);
    }
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf pdf document proxy
   */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;

    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Handle error callback
   *
   * @param error error message
   */
  onError(error: any) {
    this.error = error; // set error

    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc: PDFSource;

    if (this.pdfSrc instanceof ArrayBuffer) {
      newSrc = { data: this.pdfSrc as any };
      // newSrc = { data: this.pdfSrc };
    } else if (typeof this.pdfSrc === 'string') {
      newSrc = { url: this.pdfSrc };
    } else {
      newSrc = { ...this.pdfSrc };
    }

    newSrc.password = password;

    this.pdfSrc = newSrc;
  }

  /**
   * Pdf loading progress callback
   * @param progressData pdf progress data
   */
  onProgress(progressData: PDFProgressData) {
    console.log(progressData);
    this.progressData = progressData;

    this.isLoaded = progressData.loaded >= progressData.total;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination pdf navigate to
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.goToDestination(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage() {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: 3
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param e custom event
   */
  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

  /**
   * Page initialized callback.
   *
   * @param {CustomEvent} e
   */
  pageInitialized(e: CustomEvent) {
    console.log('(page-initialized)', e);
  }

  /**
   * Page change callback, which is called when a page is changed (called multiple times)
   *
   * @param e number
   */
  pageChange(e: number) {
    console.log('(page-change)', e);
  }

  searchQueryChanged(newQuery: string) {
    const type = newQuery !== this.pdfQuery ? '' : 'again';
    this.pdfQuery = newQuery;

    this.pdfComponent.eventBus.dispatch('find', {
      type,
      query: this.pdfQuery,
      highlightAll: true,
      caseSensitive: false,
      phraseSearch: true,
      // findPrevious: undefined,
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mobile = (event.target as Window).innerWidth <= 768;
  }
}