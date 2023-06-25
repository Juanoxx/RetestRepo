import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { EvaluationsDetailComponent } from './pages/evaluations-detail/evaluations-detail.component';
import { PruebaComponent } from './pages/prueba/prueba.component';

const routes: Routes = [{
  path: '',
  children: [
    { path: 'evaluaciones', component: EvaluationsComponent },
    { path: 'evaluaciones/detail', component: EvaluationsDetailComponent },
    { path: 'prueba', component: PruebaComponent },
    { path: '**', redirectTo: 'evaluaciones', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
