import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapsPage } from './maps.page';

const routes: Routes = [
  {
    path: '',
    component: MapsPage
  },
  {
    path: 'home',
    redirectTo: '/home'
  },
  {
    path: 'info-autor',
    redirectTo: '/info-autor'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapsPageRoutingModule {}
