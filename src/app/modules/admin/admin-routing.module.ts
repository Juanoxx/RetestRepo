import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementTeachersComponent } from './pages/management-teachers/management-teachers.component';

const routes: Routes = [
  { path: 'home', component: ManagementTeachersComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
