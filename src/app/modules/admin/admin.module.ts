import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManagementTeachersComponent } from './pages/management-teachers/management-teachers.component';
import { TeacherRoutingModule } from '../teacher/teacher-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogComponent } from './pages/management-teachers/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogColegioComponent } from './pages/management-teachers/dialog-colegio/dialog-colegio.component';
import { DialogCursoComponent } from './pages/management-teachers/dialog-curso/dialog-curso.component';

@NgModule({
  declarations: [
    ManagementTeachersComponent,
    DialogComponent,
    DialogColegioComponent,
    DialogCursoComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TeacherRoutingModule,
    SharedModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
