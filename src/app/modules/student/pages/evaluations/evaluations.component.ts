import { Component, OnInit, ElementRef } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

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
    await this.getPruebas();
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
        const prueba:any = { id: docs.id, ...rest };
  
        const cursoRef = doc(db, `colegios/${this.colegioId}/cursos/${prueba.idCurso}`);
        const cursoDoc:any = await getDoc(cursoRef);
  
        prueba.curso = {
          nivel: cursoDoc.data().nivel,
          seccion: cursoDoc.data().seccion
        };
  
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
}
