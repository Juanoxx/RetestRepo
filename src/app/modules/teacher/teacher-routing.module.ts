import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursesComponent } from './pages/curses/curses.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { CurseDetailComponent } from './pages/curse-detail/curse-detail.component';
import { CurseDetailTestComponent } from './pages/curse-detail-test/curse-detail-test.component';

const routes: Routes = [{
  path: '',
  children: [
    { path: 'cursos', component: CursesComponent },
    { path: 'cursos/detail', component: CurseDetailComponent },
    { path: 'cursos/detail/test', component: CurseDetailTestComponent },
    { path: 'evaluaciones', component: EvaluationsComponent },
    { path: '**', redirectTo: 'cursos', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
