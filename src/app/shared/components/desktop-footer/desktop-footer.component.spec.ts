import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopFooterComponent } from './desktop-footer.component';

describe('DesktopFooterComponent', () => {
  let component: DesktopFooterComponent;
  let fixture: ComponentFixture<DesktopFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
