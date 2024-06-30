import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSeperatorComponent } from './time-seperator.component';

describe('TimeSeperatorComponent', () => {
  let component: TimeSeperatorComponent;
  let fixture: ComponentFixture<TimeSeperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSeperatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeSeperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
