import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasStudentsComponent } from './pruebas-students.component';

describe('PruebasStudentsComponent', () => {
  let component: PruebasStudentsComponent;
  let fixture: ComponentFixture<PruebasStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebasStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebasStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
