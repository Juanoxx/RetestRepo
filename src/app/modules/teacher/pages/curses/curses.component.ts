import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curses',
  templateUrl: './curses.component.html',
  styleUrls: ['./curses.component.css']
})
export class CursesComponent implements OnInit {

  constructor(private th: TeacherService,
    private router: Router) { }

  ngOnInit(): void {
  }

  activeView: string = 'general';

  setActiveView(view: string) {
    this.activeView = view;
  }

  logout()
  {
    this.th.logout()
    .then(() => {
      this.router.navigate(['/auth']);
    })
    .catch(error => console.log(error));
  }

  createUser() {
    const user = {
      domicilio: 'Apolo Xlll 1641',
      email: 'juanadmin@gmail.cl',
      first_name: 'Juan',
      last_name: 'Arredondo',
      password: 'hashhash',
      rol: 'admin',
      rut: '19283992-0',
      telefono: '992199378'
    };
  
    this.th.createUser(user)
      .then(() => console.log('Usuario creado exitosamente.'))
      .catch(error => console.log(error));
  }
}
