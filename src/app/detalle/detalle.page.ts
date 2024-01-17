import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ejercicio } from '../ejercicios';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = '';

  document: any = {
    id: '',
    ejercicio: {} as Ejercicio,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {
    
  }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
    } else {
      this.id = '';
    }
    this.firestoreService
      .consultarPorId('ejercicio', this.id)
      .subscribe((resultado: any) => {
        if (resultado.payload.data() != null) {
          this.document.id = resultado.payload.id;
          this.document.ejercicio = resultado.payload.data();
          
        } else {
          this.document.ejercicio = {} as Ejercicio;
        }
      });
  }
}
