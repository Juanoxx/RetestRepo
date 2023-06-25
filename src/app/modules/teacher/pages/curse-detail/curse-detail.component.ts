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

  students: any[] = [];
  userId: any;
  cursoId: any;
  showModal: boolean = false;
  colegioId: any;
  pruebas: any;
  currentPruebaStudents: any;

  constructor(private th: TeacherService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.userId = sessionStorage.getItem('idUser');
    this.cursoId = this.route.snapshot.paramMap.get('cursoId');
    this.colegioId = sessionStorage.getItem('colegioId');
    console.log(this.colegioId)
    await this.getStudents();
    await this.getPruebas();
  }

  async getStudents() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, `colegios/${this.colegioId}/cursos/${this.cursoId}/alumnos`));
    this.students = []; // Reiniciar la lista de estudiantes cada vez que se hace la consulta
    querySnapshot.forEach((doc) => {
      this.students.push({ id: doc.id, ...doc.data() });
    });
    console.log(this.students)
  }

  async getPruebas() {
    const db = getFirestore();
    this.pruebas = []; // Reiniciar la lista de pruebas cada vez que se hace la consulta
    for (let student of this.students) {
      const querySnapshot = await getDocs(collection(db, `colegios/${this.colegioId}/cursos/${this.cursoId}/alumnos/${student.id}/pruebas`));
      querySnapshot.forEach((doc) => {
        this.pruebas.push({ studentId: student.id, pruebaId: doc.id, ...doc.data() });
      });
    }
    console.log(this.pruebas)
  }

  getStudentsForPrueba(index: number) {
    // Filtrar las pruebas basándose en el estudiante
    const pruebaId = this.pruebas[index].pruebaId;
    this.currentPruebaStudents = this.pruebas.filter((prueba: { pruebaId: any; }) => prueba.pruebaId === pruebaId);
}

}
