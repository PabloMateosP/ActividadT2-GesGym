import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ejercicio } from '../ejercicios';
import { FirestoreService } from '../firestore.service';

//Imports para borrar acciones con imagene
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

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

  // Variable para la imagen seleccionada
  imagenSelect: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
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
  clickBotonEdit() {
    this.edit = !this.edit;
  }

  clickSalirHome() {
    this.router.navigate(['home']);
  }

  //Función de selección de imagen 
  async seleccionarImagen() {
    //Comprobamos si la aplicaciónn tiene parámetros de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        //Si no tiene permiso de lectura se solicita al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          //Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1, //Permitir sólo 1 imagne
            outputType: 1 // 1 = Base64
          }).then(
            (results) => { // En la variable results se tienen las imágenes seleccionadas
              if (results.lenght > 0) { // Si el usuario ha elegido alguna imagen
                // En la variake imagenSelect quedará almacenadda la imagen seleccionada
                this.imagenSelect = "data:image/jpeg;base64," + results[0];
                console.log("Imagen que se ha seleccionado (En Base64): " + this.imagenSelect);
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  async subirImagen(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait ...'
    });

    // Mensaje de finalización de subida de la imagen 
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });

    // Carpeta del Storage donde se almacenará la imagen 
    let nombreCarpeta = "imagenes";

    // Mostrar el mensaje de espera
    loading.present();
    // Asignar el nombre de la imagen en función de la hora actual para 
    // evitar duplicidades de nombres 
    let nombreImage = `${new Date().getTime()}`;
    // Llamar al método 
  }
}
