import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsDetailComponent } from './evaluations-detail.component';

describe('EvaluationsDetailComponent', () => {
  let component: EvaluationsDetailComponent;
  let fixture: ComponentFixture<EvaluationsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
