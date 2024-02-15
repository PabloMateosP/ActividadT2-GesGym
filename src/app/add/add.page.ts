import { Component, OnInit } from '@angular/core';
import { Ejercicio } from '../ejercicios';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  ejercicioEditando = {} as Ejercicio;

  // Variable para la imagen seleccionada
  imagenSelect: string = "";

  constructor(private firestoreService: FirestoreService, private router: Router, private alertController: AlertController, private loadingController: LoadingController,
    private toastController: ToastController, private imagePicker: ImagePicker) { }



  async alertInsertarTarea() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Tarea añadida',
      buttons: ['OK']
    });

    await alert.present();
  }

  //Función de selección de imagen 
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

  async subirImagenYInsertarTarea() {

    if (this.imagenSelect === "") {
      // Anteriormente hemos subido una imagen default para que cuando se suba una tarea sin imagen salga una imagen por defecto 
      this.ejercicioEditando.imagenURL = "https://firebasestorage.googleapis.com/v0/b/gesgym-4c524.appspot.com/o/imagenes%2F1707992718599?alt=media&token=bfe78c69-4362-433f-b549-30a32ca6f668";
      this.clickBotonInsertar();
    }

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
      this.ejercicioEditando.imagenURL = downloadURL;

      // Mostrar el mensaje de finalización de la subida
      toast.present();

      // Ocultar el mensaje de espera
      loading.dismiss();

      // Ahora que la imagen está subida, puedes llamar a la función para insertar la tarea completa
      this.clickBotonInsertar();
    } catch (error) {
      console.error("Error uploading image: ", error);
      // Manejar el error según tus necesidades
      loading.dismiss();
      // Mostrar un mensaje de error si es necesario
    }
  }

  clickBotonInsertar() {
    console.log("Insertando datos a Firebase ...");
    console.log("Imagen URL:" + this.ejercicioEditando.imagenURL);
    this.firestoreService.insertar('ejercicio', this.ejercicioEditando).then(() => {
      this.alertInsertarTarea();
      this.router.navigate(['home']);
    });
  }

  clickBotonReset() {
    this.ejercicioEditando = { titulo: "", descripcion: "", musculosUsados: "", repeticiones: 0, series: 0, imagenURL: "" };
  }

  clickSalirHome() {
    this.router.navigate(['home']);
  }

  ngOnInit() {
  }

}
