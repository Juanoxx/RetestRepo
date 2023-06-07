import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManagementTeachersComponent } from './pages/management-teachers/management-teachers.component';
import { ManagementStudentsComponent } from './pages/management-students/management-students.component';


@NgModule({
  declarations: [
    ManagementTeachersComponent,
    ManagementStudentsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
