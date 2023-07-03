import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { CursesComponent } from './pages/curses/curses.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { CurseDetailComponent } from './pages/curse-detail/curse-detail.component';
import { SharedModule } from "../../shared/shared.module";
import { CreateEvaluationComponent } from './pages/create-evaluation/create-evaluation.component';
import { FormsModule } from '@angular/forms';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';
import { CustomNumberPipe, PruebasStudentsComponent } from './pages/pruebas-students/pruebas-students.component';


@NgModule({
    declarations: [
        CursesComponent,
        EvaluationsComponent,
        CurseDetailComponent,
        CreateEvaluationComponent,
        StudentDetailComponent,
        PruebasStudentsComponent,
        CustomNumberPipe
    ],
    imports: [
        CommonModule,
        TeacherRoutingModule,
        SharedModule,
        FormsModule
    ]
})
export class TeacherModule { }
