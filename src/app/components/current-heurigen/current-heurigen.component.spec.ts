import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentHeurigenComponent } from './current-heurigen.component';

describe('CurrentHeurigenComponent', () => {
  let component: CurrentHeurigenComponent;
  let fixture: ComponentFixture<CurrentHeurigenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentHeurigenComponent]
    });
    fixture = TestBed.createComponent(CurrentHeurigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
