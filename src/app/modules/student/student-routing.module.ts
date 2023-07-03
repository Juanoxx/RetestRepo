import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';
import { EvaluationsDetailComponent } from './pages/evaluations-detail/evaluations-detail.component';
import { PruebaComponent } from './pages/prueba/prueba.component';
import { DetailPruebaComponent } from './pages/detail-prueba/detail-prueba.component';

const routes: Routes = [{
  path: '',
  children: [
    { path: 'evaluaciones', component: EvaluationsComponent },
    { path: 'evaluaciones/detail/:idCurso/:idPrueba', component: EvaluationsDetailComponent },
    { path: 'evaluaciones/detail/:idCurso/:idPrueba/:numIntento', component: DetailPruebaComponent },
    { path: 'prueba/:idCurso/:idPrueba/:numIntento', component: PruebaComponent },
    { path: '**', redirectTo: 'evaluaciones', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
