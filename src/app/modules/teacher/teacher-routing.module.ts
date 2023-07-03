import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursesComponent } from './pages/curses/curses.component';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { CurseDetailComponent } from './pages/curse-detail/curse-detail.component';
import { CreateEvaluationComponent } from './pages/create-evaluation/create-evaluation.component';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';
import { PruebasStudentsComponent } from './pages/pruebas-students/pruebas-students.component';

const routes: Routes = [{
  path: '',
  children: [
    { path: 'cursos', component: CursesComponent },
    { path: 'cursos/:cursoId/detail', component: CurseDetailComponent },
    { path: 'cursos/:cursoId/detail/:idPrueba/:idStudent', component: StudentDetailComponent },
    { path: 'cursos/prueba/:idUser/:idCurso/:idPrueba/:numIntento', component: PruebasStudentsComponent },
    { path: 'evaluaciones', component: EvaluationsComponent },
    { path: 'crear', component: CreateEvaluationComponent },
    { path: '**', redirectTo: 'cursos', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
