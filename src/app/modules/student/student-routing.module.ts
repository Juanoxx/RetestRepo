import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsComponent } from './pages/evaluations/evaluations.component';

const routes: Routes = [{
  path: '',
  children: [
    { path: 'evaluaciones', component: EvaluationsComponent },
    { path: '**', redirectTo: 'evaluaciones', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
