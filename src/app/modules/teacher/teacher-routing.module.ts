import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursesComponent } from './pages/curses/curses.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';

const routes: Routes = [{
  path: '',
  children: [
    { path: 'cursos', component: CursesComponent },
    { path: 'evaluaciones', component: EvaluationsComponent },
    { path: '**', redirectTo: 'cursos', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
