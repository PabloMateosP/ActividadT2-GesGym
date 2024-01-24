import { Component, OnInit } from '@angular/core';
import { Ejercicio } from '../ejercicios';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  ejercicioEditando = {} as Ejercicio;

  constructor(private firestoreService: FirestoreService , private router: Router) { }

  clickBotonInsertar() {
    this.firestoreService.insertar('ejercicio', this.ejercicioEditando);
    
    this.router.navigate(['home']);
  }

  clickBotonReset() {
    this.ejercicioEditando = {titulo: "", descripcion: "", musculosUsados: "", repeticiones: 0, series: 0};
  }

  clickSalirHome(){
    this.router.navigate(['home']);
  }
  
  ngOnInit() {
  }

}
