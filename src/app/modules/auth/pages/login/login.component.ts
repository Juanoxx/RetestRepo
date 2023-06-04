// LoginComponent
import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formReg: FormGroup;
  showError: boolean;  // Nuevo campo para controlar el mensaje de error

  constructor(private th: TeacherService, private router: Router) {  // Inyecta el servicio Router
    this.formReg = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.showError = false;  // Inicializa el campo en false
   }

  ngOnInit(): void {
  }

  login(){
    console.log(this.formReg.value);
    this.th.login(this.formReg.value)
    .then(response => {
      console.log(response);
      this.router.navigate(['/teacher/cursos']);  // Navega a la nueva ruta si el login es exitoso
    })
    .catch(error => {
      console.log(error);
      this.showError = true;  // Muestra el mensaje de error si hay un fallo en el login
    });
  }
}
