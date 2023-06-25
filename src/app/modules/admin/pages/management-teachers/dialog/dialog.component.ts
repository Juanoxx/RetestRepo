import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service'; 
import { getDocs, collection } from 'firebase/firestore'; 

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent{
  roles = ['student', 'teacher', 'admin'];
  userForm: FormGroup;
  adminService: AdminService; 
  colegios:any = []; 
  niveles: string[] = Array.from({length: 8}, (_, i) => `${i + 1} basico`).concat(['1 medio', '2 medio', '3 medio', '4 medio']);
  secciones: string[] = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)); // letras de A a Z
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, // Inyecta los datos pasados al diálogo aquí
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
      'telefono': new FormControl('', [Validators.required]), // este patrón es un ejemplo para validar números de 10 dígitos, ajusta de acuerdo a tus necesidades
      'colegio': new FormControl(''),
      'nivel': new FormControl(''),
      'seccion': new FormControl(''),
    });
    this.userForm.get('rol')?.valueChanges.subscribe((rol) => {
      if (rol === 'student') { // si el rol seleccionado es 'student', habilita los campos
        this.userForm.get('nivel')?.enable();
        this.userForm.get('seccion')?.enable();
      } else { // si el rol seleccionado no es 'student', deshabilita los campos
        this.userForm.get('nivel')?.disable();
        this.userForm.get('seccion')?.disable();
      }
    });
  }


  async ngOnInit() {
    const querySnapshot = await getDocs(collection(this.adminService.firestore, 'colegios'));
    this.colegios = querySnapshot.docs.map(doc => doc.data());
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      let data = this.userForm.value;
  
      if (this.userForm.get('rol')?.value !== 'student') {
        delete data.nivel; // elimina el campo 'nivel' si no es 'student'
        delete data.seccion; // elimina el campo 'seccion' si no es 'student'
      }
  
      this.adminService.createUser(data, this.colegios) 
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
