import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurseDetailTestComponent } from './curse-detail-test.component';

describe('CurseDetailTestComponent', () => {
  let component: CurseDetailTestComponent;
  let fixture: ComponentFixture<CurseDetailTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurseDetailTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurseDetailTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
