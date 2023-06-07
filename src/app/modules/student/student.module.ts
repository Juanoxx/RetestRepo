import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';


@NgModule({
  declarations: [
    EvaluationsComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
