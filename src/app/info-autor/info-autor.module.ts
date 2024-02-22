import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoAutorPageRoutingModule } from './info-autor-routing.module';

import { InfoAutorPage } from './info-autor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoAutorPageRoutingModule
  ],
  declarations: [InfoAutorPage]
})
export class InfoAutorPageModule {}
