import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogColegioComponent } from './dialog-colegio.component';

describe('DialogColegioComponent', () => {
  let component: DialogColegioComponent;
  let fixture: ComponentFixture<DialogColegioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogColegioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogColegioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
