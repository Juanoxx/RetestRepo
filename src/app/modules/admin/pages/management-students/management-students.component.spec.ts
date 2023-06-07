import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementStudentsComponent } from './management-students.component';

describe('ManagementStudentsComponent', () => {
  let component: ManagementStudentsComponent;
  let fixture: ComponentFixture<ManagementStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
