import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopContentComponent } from './desktop-content.component';

describe('DesktopContentComponent', () => {
  let component: DesktopContentComponent;
  let fixture: ComponentFixture<DesktopContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
