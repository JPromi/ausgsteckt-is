import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHeurigenComponent } from './all-heurigen.component';

describe('AllHeurigenComponent', () => {
  let component: AllHeurigenComponent;
  let fixture: ComponentFixture<AllHeurigenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllHeurigenComponent]
    });
    fixture = TestBed.createComponent(AllHeurigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
