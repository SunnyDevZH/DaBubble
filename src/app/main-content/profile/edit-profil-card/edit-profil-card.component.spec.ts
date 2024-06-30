import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfilCardComponent } from './edit-profil-card.component';

describe('EditProfilCardComponent', () => {
  let component: EditProfilCardComponent;
  let fixture: ComponentFixture<EditProfilCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfilCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProfilCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
