import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ejercicio } from '../ejercicios';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = '';

  // Variable para la aparición del formulario editar
  edit = false;

  document: any = {
    id: '',
    ejercicio: {} as Ejercicio,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router : Router
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

  clickBotonModificar() {
    this.firestoreService.modificar(
      'ejercicio',
      this.id,
      this.document.ejercicio    
      );
  }
  
  clickBotonBorrar() {
    this.firestoreService.borrar('ejercicio', this.id);
    this.router.navigate(['home']);
  }

  // Mediante esta función hacemos que cuando se utilice 
  // aparezca el formulario 
  clickBotonEdit(){
    this.edit = !this.edit;
  }
  
  clickSalirHome(){
    this.router.navigate(['home']);
  }
}
