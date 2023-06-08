import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManagementTeachersComponent } from './pages/management-teachers/management-teachers.component';
import { ManagementStudentsComponent } from './pages/management-students/management-students.component';
import { TeacherRoutingModule } from '../teacher/teacher-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ManagementTeachersComponent,
    ManagementStudentsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TeacherRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
