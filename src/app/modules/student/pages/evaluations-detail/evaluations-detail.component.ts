import { Component, OnInit, ElementRef } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations-detail',
  templateUrl: './evaluations-detail.component.html',
  styleUrls: ['./evaluations-detail.component.css']
})
export class EvaluationsDetailComponent implements OnInit {
  selectedTest: any = null;

  tests = [
    {
      status: 'green',
      testName: 'Prueba de geometría: Angulos',
      course: '3°A',
      attempts: 1,
      date: '01-01-2020',
      grade: '5,8',
    },
    {
      status: 'green',
      testName: 'Prueba de geometría: Plano Cartesiano',
      course: '3°A',
      attempts: 2,
      date: '01-02-2020',
      grade: '5,9',
    }
  ];

  constructor(private th: TeacherService,
    private router: Router,
    private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  selectTest(event: Event, test: any) {
    event.stopPropagation();
    this.selectedTest = test;
  }

  resetSelection(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.selectedTest = null;
    }
  }
}
