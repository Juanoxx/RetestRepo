import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public sections = [
    { id: 'secction-1', name: 'Descripción' },
    { id: 'secction-2', name: 'Equipo' },
    { id: 'secction-3', name: 'Nuestros propósitos' },
    { id: 'secction-4', name: 'Funcionamiento' },
    { id: 'secction-5', name: 'Contacto' }
  ];
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
  }

  public scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
    }
  }
  
}
