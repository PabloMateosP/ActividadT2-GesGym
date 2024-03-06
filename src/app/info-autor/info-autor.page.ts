import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
@Component({
  selector: 'app-info-autor',
  templateUrl: './info-autor.page.html',
  styleUrls: ['./info-autor.page.scss'],
})
export class InfoAutorPage implements OnInit {

  constructor(private callNumber: CallNumber) { }

  ngOnInit() {
  }

  realizarLlamada(numero: string) {
    this.callNumber.callNumber(numero, true)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
  }

}
