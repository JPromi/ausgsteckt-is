import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsConfirmComponent } from './settings-confirm.component';

describe('SettingsConfirmComponent', () => {
  let component: SettingsConfirmComponent;
  let fixture: ComponentFixture<SettingsConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsConfirmComponent]
    });
    fixture = TestBed.createComponent(SettingsConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
