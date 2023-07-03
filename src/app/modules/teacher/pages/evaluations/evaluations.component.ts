import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {

  pruebas: any[] = [];
  
  userRole: any;
  userId: any;
  colegioId: any;
  constructor(private th: TeacherService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    
    this.userRole = sessionStorage.getItem('userRole');
    this.userId = sessionStorage.getItem('idUser');
    this.colegioId = sessionStorage.getItem('colegioId');

    Swal.fire({
      title: 'Cargando pruebas...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    await this.getPruebas();

    Swal.close();
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
  
        // Obtener datos del curso de la prueba
        const cursoRef = doc(db, `colegios/${this.colegioId}/cursos/${prueba.idCurso}`);
        const cursoDoc:any = await getDoc(cursoRef);
  
        // Agregar datos del curso a la prueba
        prueba.curso = {
          nivel: cursoDoc.data().nivel,
          seccion: cursoDoc.data().seccion
        };
  
        return prueba;
      });
  
      // Espera a que todas las promesas se resuelvan y añade los resultados a la lista de pruebas
      const resolvedPruebas = await Promise.all(pruebasPromises);
      this.pruebas.push(...resolvedPruebas);
    }
  
    console.log(this.pruebas);
  }
  
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', options).format(date) + ' Hr';
  }  

  goToAgregarAlumnos(evaluacionId: string) {
    this.router.navigate([`teacher/cursos/${evaluacionId}/detail`]);
    console.log(`teacher/cursos/${evaluacionId}/detail`)
  }

  isTestActive(fechaInicio: string, fechaTermino: string): boolean {
    const now = new Date();
    const inicio = new Date(fechaInicio);
    const termino = new Date(fechaTermino);
  
    // Verifica si la fecha actual está dentro del rango de fechas de la prueba
    return inicio <= now && now <= termino;
  }
  
}
