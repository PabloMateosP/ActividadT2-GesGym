import { Component } from '@angular/core';
import { Ejercicio } from '../ejercicios';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
//import { error } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ejercicioEditando = {} as Ejercicio;

  arrayColeccionEjercicios: any = [
    {
      id: '',
      ejercicio: {} as Ejercicio,
    },
  ];

  idEjercicioSelect: string = '';

  //Para meterle más páginas a una app hay que añadir este elemento Router
  constructor(private firestoreService: FirestoreService , private router: Router) {
    this.obtenerListaEjercicios();
  }

  clickBotonInsertar() {
    this.firestoreService.insertar('ejercicio', this.ejercicioEditando);
  }

  clickBotonBorrar() {
    this.firestoreService.borrar('ejercicio', this.idEjercicioSelect);
  }

  clickBotonModificar() {
    this.firestoreService.modificar(
      'ejercicio',
      this.idEjercicioSelect,
      this.ejercicioEditando
    );
  }

  obtenerListaEjercicios() {
    this.firestoreService.consultar('ejercicio').subscribe((datosRecibidos) => {
      this.arrayColeccionEjercicios = [];

      datosRecibidos.forEach((datosEjercicio) => {
        this.arrayColeccionEjercicios.push({
          id: datosEjercicio.payload.doc.id,
          ejercicio: datosEjercicio.payload.doc.data(),
        });
      });
    });
  }

  selectEjercicio(idEjercicio: string, ejercicioSelect: Ejercicio) {
    this.ejercicioEditando = ejercicioSelect;
    this.idEjercicioSelect = idEjercicio;
    
    // Para añadir una página nueva usamos el método navigate. 
    this.router.navigate(['detalle', this.idEjercicioSelect]);
    
  }
}
