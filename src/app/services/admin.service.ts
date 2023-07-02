import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, collection, getFirestore, deleteDoc, Firestore, addDoc, setDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public firestore: Firestore;

  constructor(private router: Router, private auth: Auth) {
    this.firestore = getFirestore();
  }

  async createCurso(curso: any) {
    const colegioRef = doc(this.firestore, 'colegios', curso.colegio);
    const cursoRef = await addDoc(collection(colegioRef, 'cursos'), curso);
    curso.id = cursoRef.id;
    await setDoc(doc(colegioRef, 'cursos', cursoRef.id), curso);

    // Agrega el curso al usuario correspondiente
    const userRef = doc(this.firestore, 'users', curso.profesor);
    await setDoc(doc(userRef, 'cursos', cursoRef.id), curso);

    // Buscar estudiantes que cumplen con el nivel y sección del curso
    const studentsSnapshot = await getDocs(query(collection(this.firestore, 'users'), where('nivel', '==', curso.nivel), where('seccion', '==', curso.seccion), where('rol', '==', 'student')));

    // Agrega el curso a cada estudiante encontrado
    studentsSnapshot.docs.forEach(async (docSnapshot) => {
      const studentRef = doc(this.firestore, 'users', docSnapshot.id);
      await setDoc(doc(studentRef, 'cursos', cursoRef.id), curso);
    });

    // Añadir la subcolección de alumnos al curso en la colección de colegios
    const alumnosCollectionRef = collection(doc(colegioRef, 'cursos', cursoRef.id), 'alumnos');
    studentsSnapshot.docs.forEach(async (docSnapshot) => {
      const student = docSnapshot.data();
      // Solo almacenamos la información relevante del estudiante en la subcolección 'alumnos'
      const alumnoData = {
        uid: student['uid'],
        nombre: student['nombre'],
        apellido: student['apellido'],
        email: student['email'],
        nivel: student['nivel'],
        seccion: student['seccion'],
        colegio: student['colegio'],
        domicilio: student['domicilio'],
        id: student['id'],
        rut: student['rut'],
        telefono: student['telefono']
      };
      await setDoc(doc(alumnosCollectionRef, docSnapshot.id), alumnoData);
    });

    return cursoRef;
  }

  async createColegio(colegio: any) {
    const docRef = await addDoc(collection(this.firestore, 'colegios'), {});
    colegio.id = docRef.id;
    await setDoc(doc(this.firestore, 'colegios', docRef.id), colegio);

    return docRef;
  }

  async createUser(user: any, selectedSchool: any) {
    user.state = 0; // Estado inicial de usuario no logueado
    const selectedSchol = selectedSchool.find((colegio: { nombre: any; }) => colegio.nombre === user.colegio);
    if (selectedSchol) {
      user.colegio = selectedSchol.id; // Aquí agregas el id del colegio
    }

    const docRef = await addDoc(collection(this.firestore, 'users'), user);
    user.uid = docRef.id;
    user.id = docRef.id;
    await setDoc(doc(this.firestore, 'users', docRef.id), user);

    console.log(user);
    console.log(user.rol);
    console.log(user.colegio);

    // Si el usuario es un estudiante, buscar los cursos que coinciden con su nivel y sección
    if (user.rol === 'student' && user.colegio) {
      console.log('entra aquí');
      const colegioRef = doc(this.firestore, 'colegios', user.colegio);
      const cursosSnapshot = await getDocs(query(collection(colegioRef, 'cursos'), where('nivel', '==', user.nivel), where('seccion', '==', user.seccion)));

      // Agrega cada curso encontrado al estudiante
      cursosSnapshot.docs.forEach(async (cursoDoc) => {
        const curso = cursoDoc.data();
        await setDoc(doc(this.firestore, 'users', user.uid, 'cursos', curso['id']), curso);

        // Añade el estudiante a la subcolección 'alumnos' del curso
        await addDoc(collection(doc(colegioRef, 'cursos', cursoDoc.id), 'alumnos'), user);

        // Obtén la referencia de la colección de pruebas para el curso actual
        const pruebasRef = collection(doc(colegioRef, 'cursos', cursoDoc.id), 'pruebas');

        // Obtén todas las pruebas
        const pruebasSnapshot = await getDocs(pruebasRef);
        console.log('pruebaref: ', pruebasRef)
        console.log('pruebasSnapshot: ', pruebasSnapshot)
        console.log(!pruebasSnapshot.empty)
        // Verifica si existen pruebas
        if (!pruebasSnapshot.empty) {
          // Itera a través de cada prueba y añádela a la respectiva subcolección 'pruebas' de cada curso del estudiante
          pruebasSnapshot.docs.forEach(async (pruebaDoc) => {
            const prueba:any = pruebaDoc.data();
            console.log(pruebaDoc.data(), prueba, prueba.idPrueba)
            await setDoc(doc(this.firestore, 'users', user.uid, 'cursos', curso['id'], 'pruebas', prueba['idPrueba']), prueba);
          });
        }
      });
    }

    return docRef;
  }


  async findUserByEmail(email: string) {
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    let user = null;

    querySnapshot.forEach((doc) => {
      if (doc.data()['email'] === email) {
        user = { id: doc.id, ...doc.data() };
      }
    });

    return user;
  }

  async login(credentials: { email: string, password: string }) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      return result;
    } catch (error) {
      const user: any = await this.findUserByEmail(credentials.email);
      console.log(user)
      if (user && user.password === credentials.password && user.state === 0) {
        const credential = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
        const oldId = user.id;
        user.uid = credential.user.uid;
        user.state = 1;
        const userRef = doc(this.firestore, 'users', credential.user.uid);
        await setDoc(userRef, user);
  
        // Obtener la lista de subcolecciones
        const subcollections = ['cursos']; 
  
        for (let subcollection of subcollections) {
          const oldSubcollection = collection(this.firestore, 'users', oldId, subcollection);
          const newSubcollection = collection(this.firestore, 'users', credential.user.uid, subcollection);
          const querySnapshot = await getDocs(oldSubcollection);
          
          for (let docSnapshot of querySnapshot.docs) {
            const data: any = docSnapshot.data();
  
            if (data.profesor === oldId) {
              data.profesor = credential.user.uid; // Actualizar la referencia del profesor al nuevo id
            }
  
            await setDoc(doc(newSubcollection, docSnapshot.id), data); 
            await deleteDoc(doc(oldSubcollection, docSnapshot.id));
  
            // Manejar subcolecciones anidadas
            if (subcollection === 'cursos') {
              const nestedSubcollection = 'pruebas';
              const oldNestedSubcollection = collection(oldSubcollection, docSnapshot.id, nestedSubcollection);
              const newNestedSubcollection = collection(newSubcollection, docSnapshot.id, nestedSubcollection);
              const nestedQuerySnapshot = await getDocs(oldNestedSubcollection);
              
              for (let nestedDocSnapshot of nestedQuerySnapshot.docs) {
                const nestedData: any = nestedDocSnapshot.data();
                
                // Actualizar cualquier referencia al id antiguo dentro de los documentos de 'pruebas' aquí
  
                await setDoc(doc(newNestedSubcollection, nestedDocSnapshot.id), nestedData);
                await deleteDoc(doc(oldNestedSubcollection, nestedDocSnapshot.id));
              }
            }
          }
        }
  
        await deleteDoc(doc(this.firestore, 'users', oldId));
  
        return signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      } else {
        throw error;
      }
    }
  }

}
