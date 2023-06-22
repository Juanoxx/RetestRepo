import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service'; 

@Component({
  selector: 'app-dialog-colegio',
  templateUrl: './dialog-colegio.component.html',
  styleUrls: ['./dialog-colegio.component.css']
})
export class DialogColegioComponent {

  regiones = [
    { nombre: 'Región de Arica y Parinacota', provinceas: ['Arica'] },
    { nombre: 'Región de Tarapacá', provinceas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'] },
    { nombre: 'Región de Antofagasta', provinceas: ['Antofagasta', 'Calama', 'Mejillones', 'Taltal', 'Tocopilla', 'El Loa'] },
    { nombre: 'Región de Atacama', provinceas: ['Copiapó', 'Caldera', 'Vallenar', 'Chañaral', 'Huasco'] },
    { nombre: 'Región de Coquimbo', provinceas: ['La Serena', 'Elqui', 'Choapa', 'Limarí'] },
    { nombre: 'Región de Valparaíso', provinceas: ['Valparaíso', 'Isla de Pascua', 'Los Andes', 'Petorca', 'Quillota', 'San Antonio', 'San Felipe de Aconcagua', 'Marga Marga'] },
    { nombre: 'Región Metropolitana de Santiago', provinceas: ['Santiago', 'Cordillera', 'Chacabuco', 'Maipo', 'Melipilla', 'Talagante'] },
    { nombre: 'Región del Libertador General Bernardo O\'Higgins', provinceas: ['Rancagua', 'Cachapoal', 'Cardenal Caro', 'Colchagua'] },
    { nombre: 'Región del Maule', provinceas: ['Talca', 'Cauquenes', 'Curicó', 'Linares'] },
    { nombre: 'Región del Biobío', provinceas: ['Concepción', 'Arauco', 'Biobío', 'Ñuble'] },
    { nombre: 'Región de La Araucanía', provinceas: ['Temuco', 'Cautín', 'Malleco'] },
    { nombre: 'Región de Los Ríos', provinceas: ['Valdivia', 'Ranco'] },
    { nombre: 'Región de Los Lagos', provinceas: ['Puerto Montt', 'Llanquihue', 'Chiloé', 'Osorno', 'Palena'] },
    { nombre: 'Región de Aysén del General Carlos Ibáñez del Campo', provinceas: ['Coyhaique', 'Aisén', 'Capitán Prat', 'General Carrera'] },
    { nombre: 'Región de Magallanes y de la Antártica Chilena', provinceas: ['Magallanes', 'Antártica Chilena', 'Tierra del Fuego', 'Última Esperanza'] },
  ];
  

  provinceas: any = [];

  userForm: FormGroup;
  adminService: AdminService;

  constructor(
    public dialogRef: MatDialogRef<DialogColegioComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    this.adminService = data.adminService; 
    this.userForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'region': new FormControl('', Validators.required),
      'provincea': new FormControl('', Validators.required)
      // Añade los demás campos que necesites
    });
  }

  onRegionChange(regionNombre: string) {
    let region = this.regiones.find(r => r.nombre === regionNombre);
    if (region) {
      this.provinceas = region.provinceas;
    } else {
      this.provinceas = [];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.userForm)
    if (this.userForm.valid) {
      console.log(this.userForm.value); 
      this.adminService.createColegio(this.userForm.value)
      .then(() => {
        console.log('Colegio creado exitosamente.')
        this.dialogRef.close();
      })
      .catch(error => console.log(error));
    } else {
      console.log("Formulario no válido");
    }
  }
}
