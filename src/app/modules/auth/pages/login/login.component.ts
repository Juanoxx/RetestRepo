// LoginComponent
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth } from '@angular/fire/auth';
import { Firestore } from 'firebase/firestore';
import { doc, getDoc, getFirestore } from '@angular/fire/firestore';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formReg: FormGroup;
  showError: boolean;
  auth = getAuth();

  firestore: Firestore;
  constructor(private th: TeacherService, private router: Router, private cd: ChangeDetectorRef, private admin: AdminService) { 
    this.formReg = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.showError = false;  // Inicializa el campo en false

    this.firestore = getFirestore();
  }

  ngOnInit(): void {
  }

  login() {
    Swal.fire({
      title: 'Iniciando sesión',
      didOpen: () => {
        Swal.showLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false
    });
    this.admin.login(this.formReg.value)
    .then(async (response) => {
        console.log(response);
        Swal.close();
        if (response && response.user) {
          
          // Recupera el rol del usuario
          const userRole = await getDoc(doc(this.firestore, `users/${response.user.uid}`));

          // Guarda el rol en sessionStorage
          sessionStorage.setItem('userRole', userRole.data()?.['rol']);
          sessionStorage.setItem('idUser', userRole.data()?.['uid']);
          sessionStorage.setItem('idUserStundent', userRole.data()?.['id']);
          sessionStorage.setItem('colegioId', userRole.data()?.['colegio']);
          switch (userRole.data()?.['rol']) {
            case 'teacher':
              this.router.navigate(['/teacher/cursos']);
              break;
            case 'student':
              this.router.navigate(['/student/evaluaciones']);
              break;
            case 'admin':
              this.router.navigate(['/admin/cursos']);
              break;
            default:
              // Aquí podrías redirigir a una página de error o hacer otra cosa
              break;
          }
        }
      })
      .catch((error) => {
        console.error(error);
        this.showError = true;
        this.cd.detectChanges(); 
        Swal.close();
      });
  }


}
