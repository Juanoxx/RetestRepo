import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { AdminService } from 'src/app/services/admin.service'; // Asegúrate de importar tu servicio de administrador aquí

@Component({
  selector: 'app-management-teachers',
  templateUrl: './management-teachers.component.html',
  styleUrls: ['./management-teachers.component.css']
})
export class ManagementTeachersComponent implements OnInit {
  constructor(public dialog: MatDialog, private adminService: AdminService) { } // Inyecta el servicio de administrador aquí

  ngOnInit(): void {
  }

  openFormDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { adminService: this.adminService } // Pasa el servicio de administrador al diálogo
    });
  }
}
