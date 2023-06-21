import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc, collection, getFirestore, updateDoc, deleteDoc, docData, Firestore, provideFirestore, collectionData, addDoc, setDoc, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private firestore: Firestore;

  constructor(private router: Router, private auth: Auth) {
    this.firestore = getFirestore();
  }

  // Crear un usuario en Firestore
  async createUser(user: any) {
    // Primero, crea el usuario en Firebase Authentication.
    const credential = await createUserWithEmailAndPassword(this.auth, user.email, user.password);

    // Luego, crea un documento en la colección 'users' con el mismo uid.
    return setDoc(doc(this.firestore, 'users', credential.user.uid), { ...user, uid: credential.user.uid });
  }

  async getCursos(userId: any) {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, `users/${userId}/cursos`));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  }

  async getPruebas(userId: any, cursoId: any) {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, `users/${userId}/cursos/${cursoId}/pruebas`));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  }

  async addCurso(userId: any, curso: any) {
    const db = getFirestore();
    await addDoc(collection(db, `users/${userId}/cursos`), curso);
  }

  async addPrueba(userId: any, cursoId: any, prueba: any) {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, `users/${userId}/pruebas`), prueba);
    await setDoc(doc(db, `users/${userId}/cursos/${cursoId}/pruebas`, docRef.id), prueba);
  }

  async addAlumno(userId: string, pruebaId: string, alumno: any) {
    const db = getFirestore();
    await setDoc(doc(collection(db, `users/${userId}/pruebas/${pruebaId}/alumnos`)), alumno);
  }
  // Obtener un usuario por su id
  getUser(userId: string): Observable<any> {
    return docData(doc(this.firestore, `users/${userId}`));
  }

  // Actualizar un usuario por su id
  updateUser(userId: string, user: any) {
    return updateDoc(doc(this.firestore, `users/${userId}`), user);
  }

  // Borrar un usuario por su id
  deleteUser(userId: string) {
    return deleteDoc(doc(this.firestore, `users/${userId}`));
  }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(credentials: { email: string, password: string }) {
    return signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
  }

  logout() {
    return signOut(this.auth);
  }

  getUsers() {
    // Use the collectionData function from RxFire for easy snapshot handling
    return collectionData(collection(this.firestore, 'users'), { idField: 'id' });
  }
}
