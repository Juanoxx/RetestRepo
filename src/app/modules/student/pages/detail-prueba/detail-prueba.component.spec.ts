import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPruebaComponent } from './detail-prueba.component';

describe('DetailPruebaComponent', () => {
  let component: DetailPruebaComponent;
  let fixture: ComponentFixture<DetailPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPruebaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
