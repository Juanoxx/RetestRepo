import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { addDoc, doc, setDoc } from '@angular/fire/firestore';
import { updateMetadata } from '@angular/fire/storage';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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



  imageUrl: string | undefined;
  selectedId: string;
  selectedNivel: string;
  constructor() {
    this.selectedId = '';
    this.selectedNivel = '';
  }

  async ngOnInit(): Promise<void> {
    this.userId = sessionStorage.getItem('idUser');
    await this.getCursos();
    await this.downloadFile('1-1');
    //await this.func();
  }

  async getCursos() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, `users/${this.userId}/cursos`));
    querySnapshot.forEach((doc) => {
      this.cursos.push({ id: doc.id, ...doc.data() });
      // Si el curso tiene asignaturas, agregamos cada una al array de asignaturas.
      if (doc.data()['asignatura']) {
        this.asignaturas.push(doc.data()['asignatura']);
      }
    });
    // Eliminamos duplicados.
    this.asignaturas = [...new Set(this.asignaturas)];
    console.log
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
    this.preguntas = querySnapshot.docs
      .map(doc => ({ ...(doc.data() as any), id: doc.id }))
      .filter(pregunta => pregunta.nivel === nivel && pregunta.idObjetivo === idObjetivo);
    console.log(this.preguntas);
  }

  /*async func() {
    const db = getFirestore();
    const docRef = doc(db, 'preguntas', 'oM6GaqwzfyRUWs2buUkW');

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
  }*/

  
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
