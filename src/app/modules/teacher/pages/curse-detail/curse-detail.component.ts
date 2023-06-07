import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curse-detail',
  templateUrl: './curse-detail.component.html',
  styleUrls: ['./curse-detail.component.css']
})
export class CurseDetailComponent implements OnInit {

  showModal: boolean = false;
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

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
