import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { collection, addDoc, doc, setDoc, Firestore, getDocs } from "@firebase/firestore";

@Component({
  selector: 'app-dialog-curso',
  templateUrl: './dialog-curso.component.html',
  styleUrls: ['./dialog-curso.component.css']
})
export class DialogCursoComponent implements OnInit {

  colegios: any[] = [];
  profesores: any[] = [];
  adminService: AdminService;
  userForm: FormGroup;
  anos: number[] = [];
  // Añadido aquí
  niveles: string[] = Array.from({length: 8}, (_, i) => `${i + 1} basico`).concat(['1 medio', '2 medio', '3 medio', '4 medio']);
  secciones: string[] = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)); // letras de A a Z
  asignaturas: string[] = ['Matemáticas', 'Biología','Química','Física', 'Lengua y Literatura', 'Inglés', 'Artes Visuales', 'Música', 'Tecnología']; // array to store the subjects
  constructor(
    public dialogRef: MatDialogRef<DialogCursoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.adminService = data.adminService;
    this.userForm = new FormGroup({
      'colegio': new FormControl('', Validators.required),
      'profesor': new FormControl({ value: '', disabled: true }, Validators.required),
      'nivel': new FormControl('', Validators.required),
      'seccion': new FormControl('', Validators.required),
      'anio': new FormControl('', Validators.required),
      'asignatura': new FormControl('', Validators.required),
    });
    const currentYear = new Date().getFullYear();
    this.anos = [currentYear, currentYear + 1];
  }

  ngOnInit() {
    this.getColegios();

    this.userForm?.get('colegio')?.valueChanges.subscribe(colegioId => {
      if (colegioId) {
        this.userForm?.get('profesor')?.enable();
        this.getProfesores(colegioId);
      } else {
        this.userForm?.get('profesor')?.disable();
      }
    });
  }

  async getColegios() {
    const querySnapshot = await getDocs(collection(this.adminService.firestore, 'colegios'));
    this.colegios = querySnapshot.docs.map(doc => doc.data());
    console.log(this.colegios)
  }

  async getProfesores(colegioId: string) {
    const querySnapshot = await getDocs(collection(this.adminService.firestore, 'users'));
    console.log(querySnapshot)
    this.profesores = querySnapshot.docs
      .map(doc => doc.data())
      .filter((profesor: any) => {
        console.log('ROL', profesor['rol']);
        console.log('colegio', colegioId); 
        return profesor.colegio === colegioId && profesor['rol'] === 'teacher';
      });
    console.log(this.profesores)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.userForm)
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.adminService.createCurso(this.userForm.value)
        .then(() => {
          console.log('Curso creado exitosamente.')
          this.dialogRef.close();
        })
        .catch(error => console.log(error));
    } else {
      console.log("Formulario no válido");
    }
  }
}
