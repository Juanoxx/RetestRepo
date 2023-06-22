import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCursoComponent } from './dialog-curso.component';

describe('DialogCursoComponent', () => {
  let component: DialogCursoComponent;
  let fixture: ComponentFixture<DialogCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
