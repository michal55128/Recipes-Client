import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipestransformComponent } from './recipestransform.component';

describe('RecipestransformComponent', () => {
  let component: RecipestransformComponent;
  let fixture: ComponentFixture<RecipestransformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipestransformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipestransformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
