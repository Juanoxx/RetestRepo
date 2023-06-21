import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, collection, getFirestore, updateDoc, deleteDoc, Firestore, addDoc, setDoc, getDocs, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private firestore: Firestore;

  constructor(private router: Router, private auth: Auth) {
    this.firestore = getFirestore();
  }

  async createUser(user: any) {
    // Crea un documento vacío en la colección 'pendingUsers'.
    const docRef = await addDoc(collection(this.firestore, 'pendingUsers'), {});

    // Obtén el id del documento recién creado y establece 'uid' con ese valor.
    user.uid = docRef.id;

    // Establece los datos del usuario en el documento recién creado.
    await setDoc(doc(this.firestore, 'pendingUsers', docRef.id), user);

    // Retorna la referencia del documento para usarla si es necesario.
    return docRef;
  }

  async handleFirstLogin(uid: string) {
    // Primero, obtén el documento del usuario de la colección 'pendingUsers'.
    const pendingUserDocRef = doc(this.firestore, 'pendingUsers', uid);
    const pendingUserDocSnap = await getDoc(pendingUserDocRef);

    if (pendingUserDocSnap.exists()) {
        // Obtiene los datos del usuario.
        let userData = pendingUserDocSnap.data();

        console.log(userData)
        // Verifica si userData es válido.
        if (userData) {
            // Crea un nuevo documento en la colección 'users' con un ID automático.
            const newUserDocRef = await addDoc(collection(this.firestore, 'users'), {});

            // Luego establece 'uid' al ID del nuevo documento.
            userData['uid'] = newUserDocRef.id;

            // Establece los datos del usuario en el documento recién creado.
            await setDoc(newUserDocRef, userData);
        }

        // Finalmente, elimina el documento de la colección 'pendingUsers'.
        await deleteDoc(pendingUserDocRef);
    }
}


  async findPendingUserByEmail(email: string) {
    const querySnapshot = await getDocs(collection(this.firestore, 'pendingUsers'));
    let pendingUser = null;

    querySnapshot.forEach((doc) => {
      if (doc.data()['email'] === email) {
        pendingUser = { id: doc.id, ...doc.data() };
      }
    });

    return pendingUser;
  }

  async login(credentials: { email: string, password: string }) {
    // Primero, intenta iniciar sesión normalmente.
    try {
      return await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
    } catch (error) {
      // Si la autenticación falla, busca al usuario en la colección de "usuarios pendientes".
      const pendingUser: any = await this.findPendingUserByEmail(credentials.email);
      if (pendingUser && pendingUser.password === credentials.password) {
        // Si se encuentra al usuario y la contraseña coincide,
        // crea su autenticación y mueve sus datos a la colección de "usuarios".
        const credential = await createUserWithEmailAndPassword(this.auth, pendingUser.email, pendingUser.password);
        pendingUser.uid = credential.user.uid;
        await setDoc(doc(this.firestore, 'users', credential.user.uid), pendingUser);

        // Luego, elimina el documento de la colección de "usuarios pendientes".
        await deleteDoc(doc(this.firestore, 'pendingUsers', pendingUser.id));

        // Finalmente, intenta iniciar sesión nuevamente.
        return signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      } else {
        // Si no se encuentra al usuario en "usuarios pendientes" o la contraseña no coincide,
        // vuelve a lanzar el error original.
        throw error;
      }
    }
  }
}
