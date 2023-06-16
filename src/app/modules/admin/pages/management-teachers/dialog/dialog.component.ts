import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service'; // Asegúrate de importar tu servicio de administrador aquí

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent{
  roles = ['student', 'teacher', 'admin'];
  userForm: FormGroup;
  adminService: AdminService; // Agrega una variable para el servicio de administrador

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any // Inyecta los datos pasados al diálogo aquí
  ) {
    this.adminService = data.adminService; // Asigna el servicio de administrador inyectado
    this.userForm = new FormGroup({
      'domicilio': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
      'rol': new FormControl('', Validators.required),
      'rut': new FormControl('', Validators.required),
      'telefono': new FormControl('', [Validators.required]) // este patrón es un ejemplo para validar números de 10 dígitos, ajusta de acuerdo a tus necesidades
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.userForm)
    if (this.userForm.valid) {
      console.log(this.userForm.value); // Esto imprimirá los valores del formulario en la consola
      this.adminService.createUser(this.userForm.value) // Usa el servicio de administrador aquí
      .then(() => {
        console.log('Usuario creado exitosamente.')
        this.dialogRef.close();
      })
      .catch(error => console.log(error));
    } else {
      console.log("Formulario no válido");
    }
  }
}
