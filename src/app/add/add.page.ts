import { Component, OnInit } from '@angular/core';
import { Ejercicio } from '../ejercicios';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  ejercicioEditando = {} as Ejercicio;

  constructor(private firestoreService: FirestoreService , private router: Router, private alertController: AlertController) { }

  

  async alertInsertarTarea() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Tarea añadida',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  
  clickBotonInsertar() {
    this.firestoreService.insertar('ejercicio', this.ejercicioEditando).then(() => {
      this.alertInsertarTarea();
      this.router.navigate(['home']);
    });
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
