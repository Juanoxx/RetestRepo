import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { addDoc, query, where } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export interface Objetivo {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: string;
  num_objetivo: string;
}


@Pipe({ name: 'customNumberPipe' })
export class CustomNumberPipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        // Entero
        return value.toString();
      } else {
        // Decimal con 4 dígitos de precisión
        return value.toFixed(4);
      }
    } else if (typeof value === 'string' && value.includes('/')) {
      // Fracción
      return value;
    } else {
      // En caso de otro tipo de datos, simplemente conviértelo a string
      return String(value);
    }
  }
}


@Component({
  selector: 'app-detail-prueba',
  templateUrl: './detail-prueba.component.html',
  styleUrls: ['./detail-prueba.component.css']
})
export class DetailPruebaComponent implements OnInit {

  idCurso: any;
  idPrueba: any;
  colegioId: any;
  prueba: any;
  objetivo: any;
  numIntento: any;
  idUser: any;
  idUserStundent: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.idCurso = this.route.snapshot.paramMap.get('idCurso');
    this.idPrueba = this.route.snapshot.paramMap.get('idPrueba');
    this.numIntento = this.route.snapshot.paramMap.get('numIntento');
    this.colegioId = sessionStorage.getItem('colegioId');
    this.idUser = sessionStorage.getItem('idUser');
    this.idUserStundent = sessionStorage.getItem('idUserStundent');
    console.log(`ID del Curso: ${this.idCurso}`);
    console.log(`ID de la Prueba: ${this.idPrueba}`);

    Swal.fire({
      title: 'Cargando prueba',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    await this.getPrueba().then(() => {
      Swal.close();
    }).catch(() => {
      Swal.fire('Error', 'Hubo un error al cargar la prueba', 'error');
    });

    if (this.prueba && this.prueba.preguntas && this.prueba.preguntas.length > 0) {
      const idObjetivo = this.prueba.preguntas[0].idObjetivo;
      this.objetivo = await this.getObjetivo(idObjetivo);
      console.log(this.objetivo)
    }
    
  }

  async getPrueba(): Promise<any> {
    const db = getFirestore();
  
    // Buscar la subcolección 'pruebasRealizadas'
    const idPrueba: any = await this.obtenerDocumentoPorPruebaId();
    console.log(`users/${this.idUser}/cursos/${this.idCurso}/pruebas/${idPrueba.id}/pruebasRealizadas`)
    const pruebasRealizadasRef = collection(db, `users/${this.idUser}/cursos/${this.idCurso}/pruebas/${idPrueba.id}/pruebasRealizadas`);
    const q = query(pruebasRealizadasRef, where("numIntento", "==", this.numIntento));
    const pruebasRealizadasSnapshot = await getDocs(q);
  
    // Si 'pruebasRealizadas' existe, añadir los documentos a la prueba
    if (!pruebasRealizadasSnapshot.empty) {
      this.prueba = pruebasRealizadasSnapshot.docs[0].data();
      console.log("Datos de la prueba:", this.prueba);
      return this.prueba;
    } else {
      console.log('No se encontró ninguna prueba realizada con el número de intento especificado');
      return null;
    }
  }
  
  async getObjetivo(idObjetivo: string): Promise<Objetivo | null> {
    const db = getFirestore();
    const objetivoRef = doc(db, `objetivos/${idObjetivo}`);
    const objetivoDoc = await getDoc(objetivoRef);

    if (objetivoDoc.exists()) {
      return { id: objetivoDoc.id, ...objetivoDoc.data() } as Objetivo;
    } else {
      console.log('No se encontró el objetivo de aprendizaje');
      return null;
    }
  }

  async obtenerDocumentoPorPruebaId(): Promise<any> {
    const db = getFirestore();
    const pruebasRef = collection(db, `users/${this.idUser}/cursos/${this.idCurso}/pruebas`);

    // Construir la consulta con el filtro por el campo 'id'
    const q = query(pruebasRef, where("idPrueba", "==", this.idPrueba));

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
}
