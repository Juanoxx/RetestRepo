import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";

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
  selectedTestIndex: any;
  
  constructor(
    private th: TeacherService, 
    private router: Router, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // Agrega ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    this.userId = sessionStorage.getItem('idUser');
    this.cursoId = this.route.snapshot.paramMap.get('cursoId');
    this.colegioId = sessionStorage.getItem('colegioId');
    await this.getStudents();
    await this.getPruebas();
  }
  
  async getStudents() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, `colegios/${this.colegioId}/cursos/${this.cursoId}/alumnos`));
    this.students = [];
    querySnapshot.forEach((doc) => {
      this.students.push({ id: doc.id, ...doc.data() });
    });
  }

  async getPruebas() {
    const db = getFirestore();

    const cursosRef = collection(db, `users/${this.userId}/cursos`);
    const cursosSnapshot = await getDocs(cursosRef);
  
    for (const curso of cursosSnapshot.docs) {
      const cursoId = curso.id;
      const pruebasRef = collection(db, `users/${this.userId}/cursos/${cursoId}/pruebas`);
      const pruebasSnapshot = await getDocs(pruebasRef);

      const pruebasPromises = pruebasSnapshot.docs.map(async (docs) => {
        const data = docs.data();
        const { preguntas, ...rest } = data;
        const prueba: any = { id: docs.id, ...rest };

        if (prueba.idCurso !== this.cursoId) {
          return null;
        }

        return prueba;
      });

      const resolvedPruebas = await Promise.all(pruebasPromises);
      const validPruebas = resolvedPruebas.filter(prueba => prueba !== null);
      this.pruebas.push(...validPruebas);
    }
  }

  async getStudentDataForTest(pruebaId: string) {
    const db = getFirestore();

    for (const student of this.students) {
      const idUser2: any = await this.obtenerId(student.id);
      const pruebaId2: any = await this.obtenerDocumentoPorPruebaId(idUser2.id, pruebaId);

      console.log(`users/${idUser2.id}/cursos/${this.cursoId}/pruebas/${pruebaId2.id}/pruebasRealizadas`)
      const pruebasRealizadasRef = collection(db, `users/${idUser2.id}/cursos/${this.cursoId}/pruebas/${pruebaId2.id}/pruebasRealizadas`);
      const pruebasRealizadasSnapshot = await getDocs(pruebasRealizadasRef);

      let maxNumIntento = -1;
      let maxCalificacion = -1;
      pruebasRealizadasSnapshot.forEach((doc) => {
        const data: any = doc.data();
        console.log(data.numIntento)
        if (data.numIntento > maxNumIntento ) {
          maxNumIntento = data.numIntento;
          maxCalificacion = data.calificacion;
        }
      });
      if (maxCalificacion == -1) {
        student.nota = '-';
        student.repeticiones = '-';
        student.alerta = 0;
      }
      else {
        student.nota = maxCalificacion;
        student.repeticiones = maxNumIntento;
        student.alerta = 1;
      }
    }
  }

  public obtenerRepeticiones(repeticiones: any): any {
    if (repeticiones === '-' || isNaN(repeticiones)) {
      return '-';
    } else {
      return Number(repeticiones) + 1;
    }
  }  
  
  async obtenerDocumentoPorPruebaId(idUser: any, pruebaId: any): Promise<any> {
    const db = getFirestore();
    const pruebasRef = collection(db, `users/${idUser}/cursos/${this.cursoId}/pruebas`);

    // Construir la consulta con el filtro por el campo 'id'
    const q = query(pruebasRef, where("idPrueba", "==", pruebaId));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        // Obtener el primer documento que cumple con el filtro
        const documento = querySnapshot.docs[0];
        return { id: documento.id };
      } else {
        console.log("No se encontró ningún documento con el ID especificado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      return null;
    }
  }

  async obtenerId(idUser: any): Promise<any> {
    const db = getFirestore();
    const pruebasRef = collection(db, `users`);

    // Construir la consulta con el filtro por el campo 'id'
    const q = query(pruebasRef, where("id", "==", idUser));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        // Obtener el primer documento que cumple con el filtro
        const documento = querySnapshot.docs[0];
        return { id: documento.id };
      } else {
        console.log("No se encontró ningún documento con el ID especificado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      return null;
    }
  }

  getStudentsForPrueba(index: number) {
    this.selectedTestIndex = index;  // Agrega esta línea
    this.cdr.markForCheck(); // Forzar la actualización
    const pruebaId = this.pruebas[index].idPrueba;
    this.getStudentDataForTest(pruebaId);
  }

  isTestActive(fechaInicio: string, fechaTermino: string): boolean {
    const now = new Date();
    const inicio = new Date(fechaInicio);
    const termino = new Date(fechaTermino);

    return inicio <= now && now <= termino;
  }

  goToStudentDetail(pruebaId: string, studentId: string) {
    console.log('Estudiante clickeado. Prueba ID:', pruebaId, 'Estudiante ID:', studentId);
    this.router.navigate(['teacher','cursos', this.cursoId, 'detail', pruebaId, studentId]);
}

  
}
