import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ejercicio } from '../ejercicios';
import { FirestoreService } from '../firestore.service';

//Imports para borrar acciones con imagene
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { AlertController } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

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
    private imagePicker: ImagePicker,
    private alertController: AlertController,
    private socialSharing: SocialSharing
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

  // ------------------------------------------------------------
  clickBotonBorrar() {
    this.firestoreService.borrar('ejercicio', this.id);
    this.router.navigate(['home']);
  }

  async alertBorrarTarea() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres borrar la tarea?',
      buttons: [
        {
          text: 'Denegar',
          role: 'cancel',
          handler: () => {
            this.alertError();
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.clickBotonBorrar();
            this.alertExito();
          }
        }

      ]
    });

    await alert.present();
  }

  async alertExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Tarea Borrada',
      buttons: ["Aceptar"]
    });

    await alert.present();
  }

  async alertError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'La tarea no ha sido eliminada',
      buttons: ["Aceptar"]
    });

    await alert.present();
  }
  // -----------------------------------------------------

  // Mediante esta función hacemos que cuando se utilice 
  // aparezca el formulario 
  clickBotonEdit() {
    this.edit = !this.edit;
  }

  clickSalirHome() {
    this.router.navigate(['home']);
  }

  async eliminarArchivo(fileURL: string) {
    const toast = await this.toastController.create({
      message: 'File deleted successfully',
      duration: 3000
    });
    this.firestoreService.eliminarArchivoPorUrl(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err)
      });
  }

  // -----------------------------------------------------------------------------------
  // Apartado Seleccionar Imagen 
  async seleccionarImagen() {
    //Comprobamos si la aplicaciónn tiene parámetros de lectura
    console.log("Entramos seleccionar imagen")
    this.imagePicker.hasReadPermission().then(
      (result) => {
        //Si no tiene permiso de lectura se solicita al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          console.log("Búscamos imagen en selector")
          //Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1, //Permitir sólo 1 imagne
            outputType: 1 // 1 = Base64
          }).then(
            (results) => {
              console.log(results) // En la variable results se tienen las imágenes seleccionadas
              if (results.length > 0) { // Si el usuario ha elegido alguna imagen
                console.log("Imagen seleccionado");
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

  async subirImagenYModificarTarea() {

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

    try {
      // Asignar el nombre de la imagen en función de la hora actual para evitar duplicidades de nombres
      let nombreImage = `${new Date().getTime()}`;

      // Llamar al método que sube la imagen al Storage
      const snapshot = await this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImage, this.imagenSelect);

      // Obtener la URL de descarga de la imagen
      const downloadURL = await snapshot.ref.getDownloadURL();
      console.log("downloadURL: " + downloadURL);

      // Actualizar la URL de la imagen en el documento
      this.document.ejercicio.imagenURL = downloadURL;

      // Mostrar el mensaje de finalización de la subida
      toast.present();

      // Ocultar el mensaje de espera
      loading.dismiss();

      // Ahora que la imagen está subida, puedes llamar a la función para modificar la tarea
      this.clickBotonModificar();
    } catch (error) {
      console.error("Error uploading image: ", error);
      // Manejar el error según tus necesidades
      loading.dismiss();
      // Mostrar un mensaje de error si es necesario
    }
  }

  // -------------------------------------------------------------------- //
  clickCompartir() {

    // Share via email
    this.socialSharing.share('document.ejercicio.titulo', 'document.ejercicio.descripcion', 'document.ejercicio.repeticiones', 'document.ejercicio.serie').then(() => {
      // Éxito
      console.log('¡Correo electrónico compartido con éxito!');
    }).catch((error) => {
      // Error al compartir por correo electrónico
      console.error('Error al compartir por correo electrónico:', error);
    });
    
  }
}
