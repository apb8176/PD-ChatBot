import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadDataService } from 'src/app/core/load-data.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-pdf-preview-dialog',
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrls: ['./pdf-preview-dialog.component.scss']
})
export class PdfPreviewDialogComponent {
  input_string1: any;
  load: boolean = false;
  pageNo: any;
  constructor(private loadDataService: LoadDataService,
    public dialogRef: MatDialogRef<PdfPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {


  }
  ngOnInit() {
    this.load = true;
    setTimeout(() => {
      let val = JSON.parse(JSON.stringify(this.loadDataService.input_pdf_text));
      //val.loc = 'popup'
      if (val.text.length) {
        this.loadDataService.input_pdf_text = val;
      }

      let match = val.page.match(/-(\d+)\.pdf/);
      console.log('-------', val.page, match);
      this.pageNo = match[1];

    }, 800)

  }
  onNoClick(): void {    
    this.dialogRef.close();
  }
  nextPage() {
    let pageNum = parseInt(this.pageNo);
    pageNum += 1;
    let pn = pageNum.toString();
    let newPage = this.loadDataService.input_pdf_text.page.replace(this.pageNo, pn);
    let val = JSON.parse(JSON.stringify(this.loadDataService.input_pdf_text));
    let temp =
    {
      'page': newPage,
      'loc': val.loc,
      'text': val.text
    }
    console.log('--------newpage=', newPage);

    this.loadDataService.input_pdf_text = temp;
    this.pageNo = pn;
  }
  previousPage() {
    let pageNum = parseInt(this.pageNo);
    pageNum -= 1;
    let pn = pageNum.toString();
    let newPage = this.loadDataService.input_pdf_text.page.replace(this.pageNo, pn);
    let val = JSON.parse(JSON.stringify(this.loadDataService.input_pdf_text));
    let temp =
    {
      'page': newPage,
      'loc': val.loc,
      'text': val.text
    }
    console.log('--------newpage=', newPage);

    this.loadDataService.input_pdf_text = temp;
    this.pageNo = pn;
  }
}
