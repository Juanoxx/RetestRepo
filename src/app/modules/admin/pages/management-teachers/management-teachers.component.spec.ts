import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementTeachersComponent } from './management-teachers.component';

describe('ManagementTeachersComponent', () => {
  let component: ManagementTeachersComponent;
  let fixture: ComponentFixture<ManagementTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementTeachersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
