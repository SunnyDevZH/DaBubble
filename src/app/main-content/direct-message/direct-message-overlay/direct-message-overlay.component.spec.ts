import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMessageOverlayComponent } from './direct-message-overlay.component';

describe('DirectMessageOverlayComponent', () => {
  let component: DirectMessageOverlayComponent;
  let fixture: ComponentFixture<DirectMessageOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectMessageOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectMessageOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
