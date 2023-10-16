import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

  _input_pdf_text: any = {
    page: " ",
    loc:" ",    
    text: ""
  }
  subject_highlight = new Subject();
  public _pdfData$ = this.subject_highlight.asObservable();
  constructor() {
    this.subject_highlight.subscribe(value => {
      this._input_pdf_text = value;
    })
  }
  get input_pdf_text() {
    return this._input_pdf_text;
  }

  set input_pdf_text(data) {
    this._input_pdf_text = data;
    this.subject_highlight.next(this._input_pdf_text);
  }

}
