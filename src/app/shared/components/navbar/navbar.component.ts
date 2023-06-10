import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userRole: any;
  userId: any;
  constructor(private th: TeacherService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userRole = sessionStorage.getItem('userRole');
    this.userId = sessionStorage.getItem('idUser');
    console.log(this.route.snapshot.paramMap.get('evaluacionId'));
  }

  activeView: string = 'general';

  setActiveView(view: string) {
    this.activeView = view;
  }

  logout() {
    this.th.logout()
      .then(() => {
        this.router.navigate(['/auth']);
        sessionStorage.clear();
      })
      .catch(error => console.log(error));
  }

  createUser() {
    const user = {
      domicilio: 'Apolo Xlll 1641',
      email: 'juantest@gmail.cl',
      first_name: 'Juan',
      last_name: 'Arredondo',
      password: 'hashhash',
      rol: 'teacher',
      rut: '19283992-0',
      telefono: '992199378'
    };

    this.th.createUser(user)
      .then(() => console.log('Usuario creado exitosamente.'))
      .catch(error => console.log(error));
  }

  addPrueba() {
    const prueba = {
      state: 1,
      name_test: 'Prueba1',
      total_students: 10,
      curse: 'Primero B',
      pc: 1.2,
      pn: 2.2,
      alerta: 1
    };

    this.th.addPrueba(this.userId,prueba)
      .then(() => console.log('Prueba creado exitosamente.'))
      .catch(error => console.log(error));
  }

  addAlumno() {
    const pruebaId = this.route.snapshot.paramMap.get('evaluacionId');
    if (pruebaId === null) {
      console.error('No se encontró el ID de la prueba en la ruta');
      return;
    }
  
    const alumno = {
      name: 'Luna',
      promedio: 6.8,
      repetitions: 3,
      Alerta: 1
    };
  
    this.th.addAlumno(this.userId, pruebaId, alumno)
      .then(() => console.log('Alumno agregado exitosamente.'))
      .catch(error => console.log(error));
  }  
  
}
