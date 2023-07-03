import { Component, OnInit, ElementRef } from '@angular/core';
import { query, where } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {

  selectedTest: any = null;
  tests: any[] = [];
  userId: any;
  colegioId: any;
  curso: any;
  idCurso: any;
  idPrueba: any;
  idUser: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) { }

  async ngOnInit(): Promise<void> {
    this.idCurso = this.route.snapshot.paramMap.get('cursoId');
    this.idPrueba = this.route.snapshot.paramMap.get('idPrueba');
    this.userId = this.route.snapshot.paramMap.get('idStudent');
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

    this.idUser = await this.obtenerDocumentoPorId(this.colegioId, this.idCurso, this.userId)
    const db = getFirestore();
    const testsCollection = collection(db, `colegios/${this.colegioId}/cursos/${this.idCurso}/alumnos/${this.idUser.id}/pruebas/${this.idPrueba}/pruebasRealizadas`);
    const testsSnapshot = await getDocs(testsCollection);
    testsSnapshot.forEach(doc => {
      this.tests.push(doc.data());
    });

    // Ordenar las pruebas por 'num_intento'
    this.tests.sort((a, b) => a.numIntento - b.numIntento);

    const cursoRef = doc(db, `colegios/${this.colegioId}/cursos/${this.idCurso}`);
    const cursoDoc = await getDoc(cursoRef);
    this.curso = cursoDoc.data();

    Swal.close();
  }

  selectTest(event: Event, test: any) {
    event.stopPropagation();
    this.selectedTest = test;
    console.log('/student/detail', this.idCurso, this.idPrueba, this.selectedTest?.numIntento);
  }
  

  resetSelection(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.selectedTest = null;
    }
  }

  async obtenerDocumentoPorId(colegioId: string, cursoId: string, idBuscado: string): Promise<any> {
    const db = getFirestore();
    const pruebasRef = collection(db, `colegios/${colegioId}/cursos/${cursoId}/alumnos`);

    // Construir la consulta con el filtro por el campo 'id'
    const q = query(pruebasRef, where("id", "==", idBuscado));

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

  parseAndIncrement(value: string): number {
    return Number(value) + 1;
  }
}
