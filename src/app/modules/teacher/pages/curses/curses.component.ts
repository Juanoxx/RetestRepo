import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, getDocs } from "firebase/firestore";

@Component({
  selector: 'app-curses',
  templateUrl: './curses.component.html',
  styleUrls: ['./curses.component.css']
})
export class CursesComponent implements OnInit {

  cursos: any[] = [];
  userId: any;

  constructor() { }

  async ngOnInit(): Promise<void> {
    this.userId = sessionStorage.getItem('idUser');
    await this.getCursos();
  }

  async getCursos() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, `users/${this.userId}/cursos`));
    querySnapshot.forEach((doc) => {
      this.cursos.push({ id: doc.id, ...doc.data() });
    });
  }
}
