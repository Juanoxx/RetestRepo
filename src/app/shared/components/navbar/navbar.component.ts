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

  getHomePage(): string {
    switch (this.userRole) {
      case 'admin': return '/admin/home';
      case 'student': return '/student/evaluaciones';
      case 'teacher': return '/teacher/cursos';
      default: return '/'; // Aquí puedes establecer la página de inicio predeterminada para cuando no se conozca el rol del usuario
    }
  }
  
}
