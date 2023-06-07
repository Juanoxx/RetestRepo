import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurseDetailComponent } from './curse-detail.component';

describe('CurseDetailComponent', () => {
  let component: CurseDetailComponent;
  let fixture: ComponentFixture<CurseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
