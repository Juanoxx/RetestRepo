import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent{
  roles = ['student', 'teacher', 'admin'];
  userForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private teacherService: TeacherService // inyecta tu servicio aquí
  ) {
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
      this.teacherService.createUser(this.userForm.value)
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
