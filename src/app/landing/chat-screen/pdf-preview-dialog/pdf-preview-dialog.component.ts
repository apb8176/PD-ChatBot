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
  input_string1 : any;
  load : boolean = false;
  constructor( private loadDataService : LoadDataService,
    public dialogRef: MatDialogRef<PdfPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  
    
  }
  ngOnInit(){
    this.load = true;
    // let val = JSON.parse(JSON.stringify(this.loadDataService.input_pdf_text));
    //   val.loc = 'popup'
    
    //     this.loadDataService.input_pdf_text = val;
    setTimeout(()=>{ 
      let val = JSON.parse(JSON.stringify(this.loadDataService.input_pdf_text));
      val.loc = 'popup'
      if(val.text.length){
        this.loadDataService.input_pdf_text = val;
      }      
    },500)

  }

  onNoClick(): void {
    
    let val = JSON.parse(JSON.stringify(this.loadDataService.input_pdf_text));
    let temp = 
    {
      'page':'',
      'loc' : 'chat-screen',
      'text':val.text
    }
    this.loadDataService.input_pdf_text =temp;
    this.dialogRef.close();
  }
}
