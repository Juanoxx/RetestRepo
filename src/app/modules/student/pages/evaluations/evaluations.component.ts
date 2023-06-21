import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {

  constructor(private th: TeacherService,
    private router: Router) { }

  ngOnInit(): void {
  }
}
