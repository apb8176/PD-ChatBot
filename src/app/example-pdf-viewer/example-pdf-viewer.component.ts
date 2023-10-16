
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import {
  PDFProgressData,
  PDFDocumentProxy,
  PDFSource,
  ZoomScale
} from '../pdf-viewer/pdf-viewer.module';

import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoadDataService } from '../core/load-data.service';
import { ChatService } from '../landing/chat-screen/chat.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-example-pdf-viewer',
  templateUrl: './example-pdf-viewer.component.html',
  styleUrls: ['./example-pdf-viewer.component.css'],

})
export class ExamplePdfViewerComponent implements OnInit {
  //pdfSrc: string | Uint8Array | PDFSource = 'https://stbj3z634zumnje.blob.core.windows.net/content/Consolidated Set of the GRI Standards-1.pdf?sp=r&st=2023-10-13T04:39:47Z&se=2023-10-31T12:39:47Z&spr=https&sv=2022-11-02&sr=c&sig=KjS4aPl9fHgKGxhz6w5Ji2%2B9tHsECkPY3JRFLBPwBeM%3D';  
  pdfSrc: string | Uint8Array | PDFSource = '';

  private _myVariable: BehaviorSubject<string> = new BehaviorSubject('initial value');
  // @Input() template: Observable<string> = this._myVariable.asObservable();
  @Input() template!: Observable<string>;

  page: any = 1;
  rotation: any = 0;
  zoom: any = 1.0;
  zoomScale: ZoomScale = 'page-fit';
  originalSize: any = false;
  myControl = new FormControl('');
  renderText: any = true;
  progressData!: PDFProgressData;
  isLoaded: any = false;
  stickToPage: any = false;
  showAll: any = true;
  autoresize: any = true;
  fitToPage: any = false;
  outline!: any[];
  isOutlineShown: any = false;
  pdfQuery: any = '';
  mobile: any = false;

  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;
  myGroup: any;
  pdf: any;
  error: any;
  constructor(private loadDataService: LoadDataService, private chatService: ChatService, private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.pdfSrc = 'https://stbj3z634zumnje.blob.core.windows.net/content/' + this.loadDataService.input_pdf_text.page + '?sp=r&st=2023-10-13T04:39:47Z&se=2023-10-31T12:39:47Z&spr=https&sv=2022-11-02&sr=c&sig=KjS4aPl9fHgKGxhz6w5Ji2%2B9tHsECkPY3JRFLBPwBeM%3D';
      this.spinner.hide();

    }, 500);
    setTimeout(() => {
      //this.zoomScale = newValue['loc'] == 'popup'?'page-width':'page-fit'
      this.searchQueryChanged(this.loadDataService.input_pdf_text.text);
    }, 1000)

    if (window.screen.width <= 768) {
      this.mobile = true;
    }
    this.myGroup = new FormGroup({
      firstName: new FormControl()
    });
    // setTimeout(()=>{ 
    //   let name = this.chatService.selectedFileName;
    //   console.log('-------currentFile',name);
    //   //this.pdfSrc = 'https://stbj3z634zumnje.blob.core.windows.net/content/'+name+'?sp=r&st=2023-10-13T04:39:47Z&se=2023-10-31T12:39:47Z&spr=https&sv=2022-11-02&sr=c&sig=KjS4aPl9fHgKGxhz6w5Ji2%2B9tHsECkPY3JRFLBPwBeM%3D'
    //   let val = this.loadDataService.input_pdf_text;
    //   val['text'].length?this.searchQueryChanged(val['text']):'';
    // },500)

    // let val = JSON.parse(JSON.stringify(this.loadDataService.input_pdf_text));
    // this.zoomScale = val['loc'] == 'popup'?'page-width':'page-fit'
    // this.searchQueryChanged(val['text']);
    this.loadDataService._pdfData$.subscribe((newValue: any) => {
      console.log('---------pdf Data', newValue);

      if (newValue['page']) {
        let name = newValue['page'];
        this.pdfSrc = 'https://stbj3z634zumnje.blob.core.windows.net/content/' + name + '?sp=r&st=2023-10-13T04:39:47Z&se=2023-10-31T12:39:47Z&spr=https&sv=2022-11-02&sr=c&sig=KjS4aPl9fHgKGxhz6w5Ji2%2B9tHsECkPY3JRFLBPwBeM%3D'
        this.zoomScale = newValue['loc'] == 'popup' ? 'page-width' : 'page-fit'
      }
      if (newValue['text']) {
        setTimeout(() => {
          //this.zoomScale = newValue['loc'] == 'popup'?'page-width':'page-fit'
          this.searchQueryChanged(newValue['text']);
        }, 1000)
      }
    });
    // setTimeout(()=>{ this.searchQueryChanged('download');},500)

  }

  // Load pdf
  loadPdf() {
    let name = this.chatService.selectedFileName;
    console.log('-------currentFile', name);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://stbj3z634zumnje.blob.core.windows.net/content/' + name + '?sp=r&st=2023-10-13T04:39:47Z&se=2023-10-31T12:39:47Z&spr=https&sv=2022-11-02&sr=c&sig=KjS4aPl9fHgKGxhz6w5Ji2%2B9tHsECkPY3JRFLBPwBeM%3D', true);
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
    //this.pdfQuery = 'download';
    if (typeof (this.pdfQuery) == 'string') {
      this.pdfComponent.eventBus.dispatch('find', {
        type,
        query: this.pdfQuery,
        highlightAll: true,
        caseSensitive: false,
        phraseSearch: true,
        // findPrevious: undefined,
      });
    }

  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mobile = (event.target as Window).innerWidth <= 768;
  }
}
