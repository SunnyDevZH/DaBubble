import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelEditionComponent } from './channel-edition.component';

describe('ChannelEditionComponent', () => {
  let component: ChannelEditionComponent;
  let fixture: ComponentFixture<ChannelEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelEditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
