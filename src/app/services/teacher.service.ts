import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc, collection, getFirestore, updateDoc, deleteDoc, docData, Firestore, provideFirestore, collectionData, addDoc, setDoc } from '@angular/fire/firestore';
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

  register({email, password}:any){
    return createUserWithEmailAndPassword(this.auth,email,password);
  }

  login(credentials: {email: string, password: string}) {
    return signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }
  logout(){
    return signOut(this.auth);
  }

  getUsers() {
    // Use the collectionData function from RxFire for easy snapshot handling
    return collectionData(collection(this.firestore, 'users'), {idField: 'id'});
  }
}
