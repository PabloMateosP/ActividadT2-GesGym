import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map: L.Map;
  marker: L.Marker;

  constructor() {
    this.map = {} as L.Map;
    this.marker = {} as L.Marker;
  }

  ionViewDidEnter(){
    this.loadMap();
  }

  loadMap() {
    let latitud = 36.6797047;
    let longitud = -5.4470656;
    let zoom = 17;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
        L.marker([latitud,longitud]).addTo(this.map);
  }

  ngOnInit() {
  }

}
