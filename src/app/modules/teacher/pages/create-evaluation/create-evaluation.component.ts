import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { addDoc, doc, setDoc } from '@angular/fire/firestore';
import { updateMetadata } from '@angular/fire/storage';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2';

interface Objetivo {
  id: string;
  nivel: string;
  num_objetivo: number;
}
@Component({
  selector: 'app-create-evaluation',
  templateUrl: './create-evaluation.component.html',
  styleUrls: ['./create-evaluation.component.css']
})
export class CreateEvaluationComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  cursos: any[] = [];
  asignaturas: any[] = [];
  selectedCursoIndex: number = 0;
  userId: any;
  nombreEvaluacion: string = '';
  objetivosAprendizaje: any[] = [];
  selectedObjetivo: any
  preguntas: any[] = [];
  fechaInicio: any;
  fechaTermino: any;

  preguntasDisponibles: any[] = [];
  preguntasSeleccionadas: any[] = [];
  preguntasParaMover: any[] = [];




  imageUrl: string | undefined;
  selectedId: string;
  selectedNivel: string;
  colegioId: any;
  constructor() {
    this.selectedId = '';
    this.selectedNivel = '';
  }

  async ngOnInit(): Promise<void> {
    this.userId = sessionStorage.getItem('idUser');
    this.colegioId = sessionStorage.getItem('colegioId');
    await this.getCursos();
    await this.downloadFile('1-1');
  }

  async getCursos() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, `users/${this.userId}/cursos`));
    querySnapshot.forEach((doc) => {
      // Agrega al array de cursos solo si la asignatura es Matemáticas
      if (doc.data()['asignatura'] === 'Matemáticas') {
        this.cursos.push({ id: doc.id, ...doc.data() });
      }
      // Si el curso tiene asignaturas, agregamos cada una al array de asignaturas.
      if (doc.data()['asignatura']) {
        this.asignaturas.push(doc.data()['asignatura']);
      }
    });
    // Eliminamos duplicados.
    this.asignaturas = [...new Set(this.asignaturas)];
    console.log(this.cursos);
  }


  async downloadFile(path: string) {
    const storage = getStorage();
    const storageRef = ref(storage, path);

    this.imageUrl = await getDownloadURL(storageRef);
  }

  async getObjetivosAprendizaje(nivel: string) {
    if (nivel) {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'objetivos'));
      this.objetivosAprendizaje = querySnapshot.docs
        .map(doc => ({ ...(doc.data() as Objetivo), id: doc.id }))
        .filter(objetivo => objetivo.nivel === nivel)
        .sort((a, b) => a.num_objetivo - b.num_objetivo);
      console.log(this.objetivosAprendizaje);
      console.log(nivel);
    }
  }


  async ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    if (changes['selectedCursoIndex'] && changes['selectedCursoIndex'].currentValue != null) {
      await this.getObjetivosAprendizaje(this.cursos[this.selectedCursoIndex]?.nivel);
    }
  }

  async getPreguntas(nivel: string) {
    const idObjetivo = this.selectedObjetivo;
    console.log(nivel, idObjetivo)
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'preguntas'));
    this.preguntasDisponibles = querySnapshot.docs
      .map(doc => ({ ...(doc.data() as any), id: doc.id }))
      .filter(pregunta => pregunta.nivel === nivel && pregunta.idObjetivo === idObjetivo);
    console.log(this.preguntasDisponibles);
  }

  seleccionarPregunta(pregunta: any) {
    console.log(pregunta)
    // Cambiar el estado de selección de la pregunta.
    pregunta.seleccionada = !pregunta.seleccionada;
    // Actualizar la lista de preguntas para mover basada en su estado de selección.
    this.preguntasParaMover = this.preguntasDisponibles.filter(p => p.seleccionada);
  }

  moverPreguntasSeleccionadas() {
    this.preguntasParaMover.forEach(p => {
      // Mover la pregunta de las disponibles a las seleccionadas.
      this.preguntasSeleccionadas.push(p);
      // Remover la pregunta de las disponibles.
      this.preguntasDisponibles = this.preguntasDisponibles.filter(pDisponible => pDisponible.id !== p.id);
      // Desmarcar la pregunta.
      p.seleccionada = false;
    });
    // Limpiar la lista de preguntas para mover.
    this.preguntasParaMover = [];
  }

  moverPreguntasDeSeleccionadas() {
    // Crear una nueva lista de preguntas seleccionadas
    let nuevasPreguntasSeleccionadas: any[] = [];

    // Recorrer las preguntas seleccionadas y mover las seleccionadas a disponibles.
    this.preguntasSeleccionadas.forEach((p, index) => {
      // Solo mover la pregunta si está seleccionada.
      if (p.seleccionada) {
        // Mover la pregunta de las seleccionadas a las disponibles.
        this.preguntasDisponibles.push(p);
        // Desmarcar la pregunta.
        p.seleccionada = false;
      } else {
        // Si la pregunta no está seleccionada, la agregamos a la nueva lista de preguntas seleccionadas.
        nuevasPreguntasSeleccionadas.push(p);
      }
    });

    // Ahora, reemplazamos la antigua lista de preguntas seleccionadas por la nueva.
    this.preguntasSeleccionadas = nuevasPreguntasSeleccionadas;
  }


  seleccionarPreguntaSeleccionada(pregunta: any) {
    // Cambiar el estado de selección de la pregunta.
    pregunta.seleccionada = !pregunta.seleccionada;
  }

  async createTest() {
    try {
      const db = getFirestore();

      // Verificación de los campos
      if (!this.cursos[this.selectedCursoIndex]?.id) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'El campo Curso no puede estar vacío!',
        });
        return;
      }

      if (!this.nombreEvaluacion) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'El campo Nombre de la Evaluación no puede estar vacío!',
        });
        return;
      }

      if (!this.fechaInicio) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'El campo Fecha de Inicio no puede estar vacío!',
        });
        return;
      }

      if (!this.fechaTermino) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'El campo Fecha de Término no puede estar vacío!',
        });
        return;
      }

      if (!this.preguntasSeleccionadas || this.preguntasSeleccionadas.length == 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Debe seleccionar al menos una pregunta!',
        });
        return;
      }

      const test:any = {
        preguntas: this.preguntasSeleccionadas,
        idCurso: this.cursos[this.selectedCursoIndex]?.id,
        nombrePrueba: this.nombreEvaluacion,
        fechaInicio: this.fechaInicio,
        fechaTermino: this.fechaTermino
      };
      
      // Guarda en subcolección pruebas de colegios/cursos/
      const docRef = await addDoc(collection(db, `colegios/${this.colegioId}/cursos/${this.cursos[this.selectedCursoIndex]?.id}/pruebas`), test);
      
      // Establece idPrueba con el ID del documento generado automáticamente
      test.idPrueba = docRef.id;
      
      // Actualiza el documento en Firestore con el nuevo test
      await setDoc(docRef, test);
      
      // Obtén la referencia de la colección de estudiantes para el curso seleccionado.
      const studentsRef = collection(db, `colegios/${this.colegioId}/cursos/${this.cursos[this.selectedCursoIndex]?.id}/alumnos`);
      
      // Obten todos los estudiantes
      const studentSnapshot = await getDocs(studentsRef);
      
      // Itera a través de cada estudiante y añade la prueba a su respectiva colección.
      studentSnapshot.docs.forEach(async (doc) => {
        const studentId = doc.id;
        await addDoc(collection(db, `colegios/${this.colegioId}/cursos/${this.cursos[this.selectedCursoIndex]?.id}/alumnos/${studentId}/pruebas`), test);
      });
      
      // Obtén la referencia de la colección de usuarios.
      const usersRef = collection(db, `users`);
      
      // Obten todos los usuarios
      const userSnapshot = await getDocs(usersRef);
      
      // Itera a través de cada usuario y si el usuario tiene el curso seleccionado, añade la prueba a su respectiva colección.
      userSnapshot.docs.forEach(async (doc) => {
        const userId = doc.id;
        
        // Obtén la subcolección 'cursos' para este usuario
        const cursosRef = collection(db, `users/${userId}/cursos`);
        const cursosSnapshot = await getDocs(cursosRef);
      
        // Convierte los documentos de la subcolección 'cursos' en un array
        const cursos = cursosSnapshot.docs.map(doc => doc.data());
      
        // Crea un array con los ids de los cursos
        const idsCursos = cursos.map(curso => curso['id']);
        
        console.log(idsCursos);
      
        // Ahora puedes verificar si el curso actual está en la lista de cursos del usuario
        if (idsCursos.includes(this.cursos[this.selectedCursoIndex]?.id)) {
            await addDoc(collection(db, `users/${userId}/cursos/${this.cursos[this.selectedCursoIndex]?.id}/pruebas`), test);
        }
      });
    

      // Notificación SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Prueba creada!',
        text: 'Has creado la prueba exitosamente.',
      });
    }
    catch (error) {
      // Notificación SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal al crear la prueba.',
      });

      console.error(error); // Opcional: puedes manejar el error de la manera que prefieras.
    }
  }



  async createConditions() {
    const db = getFirestore();
    const docRef = doc(db, 'preguntas', '3LUAofYsHfbXoQgAtq5i');

    await setDoc(docRef, {
      variables: [
        {
          nombre: 'a',
          condiciones: [
            {
              operator: '>',
              value: 0
            }
          ]
        },
        {
          nombre: 'a',
          condiciones: [
            {
              operator: '<',
              value: 20
            }
          ]
        },
        {
          nombre: 'b',
          condiciones: [
            {
              operator: '>',
              value: 0
            }
          ]
        },
        {
          nombre: 'b',
          condiciones: [
            {
              operator: '<',
              value: 20
            }
          ]
        }
      ]
    }, { merge: true }); // Esta opción es para que se fusionen los datos en vez de reemplazar el documento
  }

  async createQuestions() {
    const db = getFirestore();
    const collectionRef = collection(db, 'preguntas');

    // Estos son los datos que quieres agregar a cada nuevo documento
    const newDocData = {
      Pregunta: 'Calcula el valor de la potencia',
      algoritmo: 'a*-b',
      conjunto: 'integer',
      id: '78',
      idObjetivo: 'vTSRM5oSQtde8HBqDa0S',
      nivel: '8 basico',
      respuesta: 'E',
      resultado: '-125',
      url: 'https://firebasestorage.googleapis.com/v0/b/retestplus.appspot.com/o/78-1?alt=media&token=2780c6fa-ada5-42c7-ad1c-7543cd9a091c',
      variables: [
        {
          nombre: 'a',
          condiciones: [
            {
              operator: '>',
              value: 0
            },
            {
              operator: '<',
              value: 20
            }
          ]
        },
        {
          nombre: 'b',
          condiciones: [
            {
              operator: '>',
              value: 0
            },
            {
              operator: '<',
              value: 20
            }
          ]
        }
      ]
    };

    await addDoc(collectionRef, newDocData);
  }

  /*async uploadFile(file: any, id: string, nivel: string) {
    const storage = getStorage();
    const storageRef = ref(storage, `${id}-1`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        //...
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Update metadata with id
        await updateMetadata(uploadTask.snapshot.ref, {
          customMetadata: {
            'id': id,
            'fileId': uploadTask.snapshot.ref.name
          }
        });

        // Save download URL, id, and nivel to Firestore
        const db = getFirestore();
        await addDoc(collection(db, 'files'), {
          url: downloadURL,
          id: id,
          nivel: nivel
        });

        console.log('File available at', downloadURL);
      }
    );
  }*/


  /*async uploadImage() {
    const file = this.fileInput.nativeElement.files[0];
    if (file) {
      await this.uploadFile(file, this.selectedId, this.selectedNivel);
    } else {
      console.log('No se seleccionó ninguna imagen.');
    }
  }*/


} 
