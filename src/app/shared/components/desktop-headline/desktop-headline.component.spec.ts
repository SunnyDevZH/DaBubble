import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopHeadlineComponent } from './desktop-headline.component';

describe('DesktopHeadlineComponent', () => {
  let component: DesktopHeadlineComponent;
  let fixture: ComponentFixture<DesktopHeadlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopHeadlineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopHeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
