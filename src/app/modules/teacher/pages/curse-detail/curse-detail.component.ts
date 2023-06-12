import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getFirestore, collection, getDocs } from "firebase/firestore";

@Component({
  selector: 'app-curse-detail',
  templateUrl: './curse-detail.component.html',
  styleUrls: ['./curse-detail.component.css']
})
export class CurseDetailComponent implements OnInit {

  pruebas: any[] = [];
  userId: any;
  cursoId: any;
  showModal: boolean = false;

  constructor(private th: TeacherService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.userId = sessionStorage.getItem('idUser');
    this.cursoId = this.route.snapshot.paramMap.get('cursoId');
    await this.getPruebas();
  }

  async getPruebas() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, `users/${this.userId}/cursos/${this.cursoId}/pruebas`));
    querySnapshot.forEach((doc) => {
      this.pruebas.push({ id: doc.id, ...doc.data() });
    });
  }

  logout() {
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
