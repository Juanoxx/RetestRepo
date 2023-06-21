import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { TeacherRoutingModule } from '../teacher/teacher-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvaluationsDetailComponent } from './pages/evaluations-detail/evaluations-detail.component';


@NgModule({
  declarations: [
    EvaluationsComponent,
    EvaluationsDetailComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    TeacherRoutingModule,
    SharedModule
  ]
})
export class StudentModule { }
