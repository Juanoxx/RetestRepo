import { Component, OnInit, ElementRef } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {
  pruebas: any[] = [];
  selectedTest: any;

  userRole: any;
  userId: any;
  colegioId: any;

  constructor(
    private th: TeacherService,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) { }

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

    const cursosRef = collection(db, `users/${this.userId}/cursos`);
    const cursosSnapshot = await getDocs(cursosRef);
    for (const curso of cursosSnapshot.docs) {
      console.log(curso.id)
      const cursoId = curso.id;
      const pruebasRef = collection(db, `users/${this.userId}/cursos/${cursoId}/pruebas`);
      const pruebasSnapshot = await getDocs(pruebasRef);

      const pruebasPromises = pruebasSnapshot.docs.map(async (docs) => {
        const data = docs.data();
        const { preguntas, ...rest } = data;
        const prueba: any = { id: docs.id, ...rest };

        const cursoRef = doc(db, `colegios/${this.colegioId}/cursos/${prueba.idCurso}`);
        const cursoDoc: any = await getDoc(cursoRef);

        prueba.curso = {
          nivel: cursoDoc.data().nivel,
          seccion: cursoDoc.data().seccion
        };

        // Buscar la subcolección 'pruebasRealizadas'
        const pruebasRealizadasRef = collection(db, `users/${this.userId}/cursos/${cursoId}/pruebas/${prueba.id}/pruebasRealizadas`);
        const pruebasRealizadasSnapshot = await getDocs(pruebasRealizadasRef);

        // Si 'pruebasRealizadas' no existe, establecer 'state' a 0
        if (pruebasRealizadasSnapshot.empty) {
          prueba.state = 0;
        } else {
          // Si 'pruebasRealizadas' existe, añadir los documentos a la prueba
          let pruebasRealizadas:any = pruebasRealizadasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          if (pruebasRealizadas.length > 0) {
            let maxCalificacion = Math.max(...pruebasRealizadas.map((pruebaRealizada: { calificacion: string; }) => parseFloat(pruebaRealizada.calificacion)));
            let maxNumIntento = Math.max(...pruebasRealizadas.map((pruebaRealizada: { numIntento: string; }) => parseInt(pruebaRealizada.numIntento)));
            prueba.maxCalificacion = maxCalificacion.toFixed(1).toString();
            prueba.maxNumIntento = (maxNumIntento + 1).toString();
            prueba.pruebasRealizadas = pruebasRealizadas;
          } else {
            prueba.state = 0;
          }
        }

        return prueba;
      });

      const resolvedPruebas = await Promise.all(pruebasPromises);
      this.pruebas.push(...resolvedPruebas);
    }

    console.log(this.pruebas);
  }


  selectTest(event: Event, prueba: any) {
    event.stopPropagation();
    this.selectedTest = prueba;
  }

  resetSelection(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.selectedTest = null;
    }
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

  isTestActive(fechaInicio: string, fechaTermino: string): boolean {
    const now = new Date();
    const inicio = new Date(fechaInicio);
    const termino = new Date(fechaTermino);

    // Verifica si la fecha actual está dentro del rango de fechas de la prueba
    return inicio <= now && now <= termino;
  }
}
