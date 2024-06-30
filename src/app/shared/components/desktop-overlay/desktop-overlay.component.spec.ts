import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopOverlayComponent } from './desktop-overlay.component';

describe('DesktopOverlayComponent', () => {
  let component: DesktopOverlayComponent;
  let fixture: ComponentFixture<DesktopOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
