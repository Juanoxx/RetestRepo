import { Component, OnInit, ElementRef } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {
  selectedTest: any = null; // Almacenará la prueba seleccionada

  tests = [
    {
      status: 'green',
      testName: 'Prueba de geometría: Angulos',
      course: '3°A',
      attempts: 2,
      date: '01-01-2020',
      grade: '5,8',
    },
    {
      status: 'red',
      testName: 'Prueba de geometría: Plano Cartesiano',
      course: '3°A',
      attempts: 0,
      date: '01-01-2020',
      grade: '-',
    }
  ]; // Esta es la lista de pruebas a iterar

  constructor(private th: TeacherService,
    private router: Router,
    private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  selectTest(event: Event, test: any) {
    // Prevenir la propagación del evento al elemento body
    event.stopPropagation();

    this.selectedTest = test;
  }

  resetSelection(event: Event) {
    // Verificar si el click fue dentro de algún elemento de la lista
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.selectedTest = null;
    }
  }
}

