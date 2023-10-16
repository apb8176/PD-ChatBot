import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPreviewDialogComponent } from './pdf-preview-dialog.component';

describe('PdfPreviewDialogComponent', () => {
  let component: PdfPreviewDialogComponent;
  let fixture: ComponentFixture<PdfPreviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfPreviewDialogComponent]
    });
    fixture = TestBed.createComponent(PdfPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
