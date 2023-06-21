import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations-detail',
  templateUrl: './evaluations-detail.component.html',
  styleUrls: ['./evaluations-detail.component.css']
})
export class EvaluationsDetailComponent implements OnInit {

  constructor(private th: TeacherService,
    private router: Router) { }

  ngOnInit(): void {
  }
}
