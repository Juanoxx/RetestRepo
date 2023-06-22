import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, collection, getFirestore, updateDoc, deleteDoc, Firestore, addDoc, setDoc, getDocs, getDoc } from '@angular/fire/firestore';
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
      user.colegioId = selectedSchol.id; // Aquí agregas el id del colegio
    }

    const docRef = await addDoc(collection(this.firestore, 'users'), user);
    user.uid = docRef.id;
    user.id = docRef.id;
    await setDoc(doc(this.firestore, 'users', docRef.id), user);

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
        await setDoc(doc(this.firestore, 'users', credential.user.uid), user);
        await deleteDoc(doc(this.firestore, 'users', oldId));

        return signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      } else {
        throw error;
      }
    }
  }

}
