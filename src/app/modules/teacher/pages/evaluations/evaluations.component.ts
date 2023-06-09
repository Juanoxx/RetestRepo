import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {

  pruebas: any[] = [];
  
  userRole: any;
  userId: any;
  constructor(private th: TeacherService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    
    this.userRole = sessionStorage.getItem('userRole');
    this.userId = sessionStorage.getItem('idUser');
    await this.getPruebas();
  }

  async getPruebas() {
    const db = getFirestore();
    const q = query(collection(db, `users/${this.userId}/pruebas`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.pruebas.push({ id: doc.id, ...doc.data() });
    });
    console.log(this.pruebas)
  }
  

  goToAgregarAlumnos(evaluacionId: string) {
    this.router.navigate([`teacher/evaluaciones/${evaluacionId}/detail`]);
    console.log(`teacher/evaluaciones/${evaluacionId}/detail`)
  }
}
