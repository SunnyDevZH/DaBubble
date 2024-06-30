import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationEmailDialogComponent } from './verification-email-dialog.component';

describe('VerificationEmailDialogComponent', () => {
  let component: VerificationEmailDialogComponent;
  let fixture: ComponentFixture<VerificationEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationEmailDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerificationEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
