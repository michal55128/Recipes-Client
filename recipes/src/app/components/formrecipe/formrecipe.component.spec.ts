import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormrecipeComponent } from './formrecipe.component';

describe('FormrecipeComponent', () => {
  let component: FormrecipeComponent;
  let fixture: ComponentFixture<FormrecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormrecipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormrecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
