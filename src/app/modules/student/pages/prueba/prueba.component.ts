import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {
  idCurso: any;
  idPrueba: any;
  colegioId: any;
  prueba: any;
  objetivo: any;
  numIntento: any;
  idUser: any;
  idUserStundent: any;
  pruebaEnviada: boolean = false;

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

    const pruebaRef = doc(db, `colegios/${this.colegioId}/cursos/${this.idCurso}/pruebas/${this.idPrueba}`);
    const pruebaDoc: any = await getDoc(pruebaRef);

    if (pruebaDoc.exists()) {
      this.prueba = { id: pruebaDoc.id, ...pruebaDoc.data() };

      // Get course data
      const cursoRef = doc(db, `colegios/${this.colegioId}/cursos/${this.idCurso}`);
      const cursoDoc: any = await getDoc(cursoRef);
      this.prueba.curso = {
        nivel: cursoDoc.data().nivel,
        seccion: cursoDoc.data().seccion
      };

      // Buscar la subcolección 'pruebasRealizadas'
      const pruebasRealizadasRef = collection(db, `colegios/${this.colegioId}/cursos/${this.idCurso}/pruebas/${this.prueba.id}/pruebasRealizadas`);
      const pruebasRealizadasSnapshot = await getDocs(pruebasRealizadasRef);

      // Si 'pruebasRealizadas' no existe, establecer 'state' a 0
      if (pruebasRealizadasSnapshot.empty) {
        this.prueba.state = 0;
      } else {
        // Si 'pruebasRealizadas' existe, añadir los documentos a la prueba
        this.prueba.pruebasRealizadas = pruebasRealizadasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      const alternativas = ['A', 'B', 'C', 'D', 'E'];

      for (const pregunta of this.prueba.preguntas) {
        const incorrectas = alternativas.filter(letra => letra !== pregunta.respuesta);
        pregunta.respuestasIncorrectas = incorrectas.reduce((respuestas: any, letra) => {
          respuestas[letra] = (+pregunta.resultado) + this.aleatorio();
          return respuestas;
        }, {});
      }

      console.log("Datos de la prueba:", this.prueba);
      return this.prueba;
    } else {
      console.log('No se encontró ninguna prueba');
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

  aleatorio() {
    return (Math.random() - 0.5) * 20;
  }

  async onSubmit(): Promise<void> {
    let totalScore = 0;
    const responses: any[] = [];
    const idUser: any = await this.obtenerDocumentoPorId(this.colegioId, this.idCurso, this.idUserStundent)

    // Comprobar si todas las preguntas han sido respondidas
    const allQuestionsAnswered = this.prueba.preguntas.every((pregunta: any) => pregunta.selectedAnswer !== undefined);

    if (!allQuestionsAnswered) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe contestar todas las preguntas.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Recorrer las preguntas y verificar las respuestas
    this.prueba.preguntas.forEach((pregunta: any) => {
      if (pregunta.selectedAnswer === pregunta.respuesta) {
        totalScore++;
      }
      responses.push(pregunta.selectedAnswer);
    });

    let calificacion = totalScore * (7 / this.prueba.preguntas.length);
    // Si la calificación es cero, asigna uno
    if (calificacion === 0) {
      calificacion = 1;
    }
    // Crear el objeto para guardar en la base de datos
    const pruebaRealizada = {
      idPrueba: this.idPrueba,
      numIntento: this.numIntento,
      calificacion: calificacion.toFixed(1),
      respuestas: responses,
      preguntas: this.prueba.preguntas
    };

    console.log(`colegios/${this.colegioId}/cursos/${this.idCurso}/alumnos/${idUser.id}/pruebas/${this.idPrueba}/pruebasRealizadas`)
    // Guardar `pruebaRealizada` en la subcolección `pruebasRealizadas`
    const db = getFirestore();
    const pruebasRealizadasRef = collection(
      db,
      `colegios/${this.colegioId}/cursos/${this.idCurso}/alumnos/${idUser.id}/pruebas/${this.idPrueba}/pruebasRealizadas`
    );

    const db2 = getFirestore();
    const pruebasRealizadasRefUsers = collection(
      db2,
      `users/${this.idUser}/cursos/${this.idCurso}/pruebas/${this.idPrueba}/pruebasRealizadas`
    );

    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, entregar!',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        await addDoc(pruebasRealizadasRef, pruebaRealizada);
        await addDoc(pruebasRealizadasRefUsers, pruebaRealizada);

        Swal.fire(
          'Entregado!',
          'Tu prueba ha sido entregada.',
          'success'
        )
        // Redirigir al usuario a la página de inicio
        this.router.navigate(['/student/evaluaciones']);
      }
    } catch (error) {
      console.error("Error al guardar la prueba realizada:", error);
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
}
