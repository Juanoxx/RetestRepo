import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

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
  pruebas: any[] = [];
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
  
    // Obtén la referencia a la colección de cursos para este usuario
    const cursosRef = collection(db, `users/${this.userId}/cursos`);
    const cursosSnapshot = await getDocs(cursosRef);
  
    // Itera a través de cada curso y obtén todas las pruebas para cada curso
    for (const curso of cursosSnapshot.docs) {
      const cursoId = curso.id;
      const pruebasRef = collection(db, `users/${this.userId}/cursos/${cursoId}/pruebas`);
      const pruebasSnapshot = await getDocs(pruebasRef);
  
      // Crea un array de promesas
      const pruebasPromises = pruebasSnapshot.docs.map(async (docs) => {
        // Crear objeto de prueba con datos de prueba y excluye 'preguntas'
        const data = docs.data();
        const { preguntas, ...rest } = data;
        const prueba:any = { id: docs.id, ...rest };
  
        // Verifica si la prueba pertenece al curso actual
        if (prueba.idCurso !== this.cursoId) {
          return null;
        }
  
        return prueba;
      });
  
      // Espera a que todas las promesas se resuelvan y añade los resultados a la lista de pruebas
      const resolvedPruebas = await Promise.all(pruebasPromises);
      const validPruebas = resolvedPruebas.filter(prueba => prueba !== null); // Filtrar pruebas nulas
      this.pruebas.push(...validPruebas);
    }
  
    console.log(this.pruebas);
  }  

  getStudentsForPrueba(index: number) {
    // Filtrar las pruebas basándose en el estudiante
    const pruebaId = this.pruebas[index].pruebaId;
    this.currentPruebaStudents = this.pruebas.filter((prueba: { pruebaId: any; }) => prueba.pruebaId === pruebaId);
  }

  isTestActive(fechaInicio: string, fechaTermino: string): boolean {
    const now = new Date();
    const inicio = new Date(fechaInicio);
    const termino = new Date(fechaTermino);
  
    // Verifica si la fecha actual está dentro del rango de fechas de la prueba
    return inicio <= now && now <= termino;
  }
}
