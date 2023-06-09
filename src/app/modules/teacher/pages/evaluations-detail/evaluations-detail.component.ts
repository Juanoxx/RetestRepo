import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

@Component({
  selector: 'app-evaluations-detail',
  templateUrl: './evaluations-detail.component.html',
  styleUrls: ['./evaluations-detail.component.css']
})
export class EvaluationsDetailComponent implements OnInit {

  alumnos: any[] = [];
  userRole: any;
  userId: any;
  constructor(private th: TeacherService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    
    this.userRole = sessionStorage.getItem('userRole');
    this.userId = sessionStorage.getItem('idUser');

    const pruebaId = this.route.snapshot.paramMap.get('evaluacionId');
    if (pruebaId !== null) {
      await this.getAlumnos(pruebaId);
    }
  }

  async getAlumnos(pruebaId: string) {
    const db = getFirestore();
    const q = query(collection(db, `users/${this.userId}/pruebas/${pruebaId}/alumnos`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.alumnos.push({ id: doc.id, ...doc.data() });
    });
    console.log(this.alumnos)
  }

}
