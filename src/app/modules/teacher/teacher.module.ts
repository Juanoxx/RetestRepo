import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { CursesComponent } from './pages/curses/curses.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { CurseDetailComponent } from './pages/curse-detail/curse-detail.component';
import { CurseDetailTestComponent } from './pages/curse-detail-test/curse-detail-test.component';


@NgModule({
  declarations: [
    CursesComponent,
    EvaluationsComponent,
    CurseDetailComponent,
    CurseDetailTestComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }
