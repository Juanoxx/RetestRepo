import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { TeacherRoutingModule } from '../teacher/teacher-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvaluationsDetailComponent } from './pages/evaluations-detail/evaluations-detail.component';
import { CustomNumberPipe, PruebaComponent } from './pages/prueba/prueba.component';
import { FormsModule } from '@angular/forms';
import { DetailPruebaComponent } from './pages/detail-prueba/detail-prueba.component';


@NgModule({
  declarations: [
    EvaluationsComponent,
    EvaluationsDetailComponent,
    PruebaComponent,
    DetailPruebaComponent,
    CustomNumberPipe
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    TeacherRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class StudentModule { }
