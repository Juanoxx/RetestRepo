import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userRole: any;
  constructor(private th: TeacherService,
    private router: Router) { }

  ngOnInit(): void {
    this.userRole = sessionStorage.getItem('userRole');
  }

  activeView: string = 'general';

  setActiveView(view: string) {
    this.activeView = view;
  }

  logout() {
    this.th.logout()
      .then(() => {
        this.router.navigate(['/auth']);
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
}
