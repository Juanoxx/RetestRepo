import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-management-teachers',
  templateUrl: './management-teachers.component.html',
  styleUrls: ['./management-teachers.component.css']
})
export class ManagementTeachersComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openFormDialog(): void {
    this.dialog.open(DialogComponent);
  }
}
