import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeurigerComponent } from './heuriger.component';

describe('HeurigerComponent', () => {
  let component: HeurigerComponent;
  let fixture: ComponentFixture<HeurigerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeurigerComponent]
    });
    fixture = TestBed.createComponent(HeurigerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
