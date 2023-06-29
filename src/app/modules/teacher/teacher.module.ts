import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { CursesComponent } from './pages/curses/curses.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { CurseDetailComponent } from './pages/curse-detail/curse-detail.component';
import { CurseDetailTestComponent } from './pages/curse-detail-test/curse-detail-test.component';
import { SharedModule } from "../../shared/shared.module";
import { EvaluationsDetailComponent } from './pages/evaluations-detail/evaluations-detail.component';
import { CreateEvaluationComponent } from './pages/create-evaluation/create-evaluation.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        CursesComponent,
        EvaluationsComponent,
        CurseDetailComponent,
        CurseDetailTestComponent,
        EvaluationsDetailComponent,
        CreateEvaluationComponent,
    ],
    imports: [
        CommonModule,
        TeacherRoutingModule,
        SharedModule,
        FormsModule
    ]
})
export class TeacherModule { }
