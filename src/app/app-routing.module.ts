import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllHeurigenComponent } from './components/all-heurigen/all-heurigen.component';
import { CurrentHeurigenComponent } from './components/current-heurigen/current-heurigen.component';
import { HeurigerComponent } from './components/heuriger/heuriger.component';
import { MapsComponent } from './components/maps/maps.component';
import { ErrorComponent } from './components/error/error.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TaxiComponent } from './components/taxi/taxi.component';

const routes: Routes = [
  { path: '', redirectTo: '/ausgsteckt', pathMatch: 'full' },
  { path: 'heurigen', component: AllHeurigenComponent },
  { path: 'heurigen/:heuriger', component: HeurigerComponent },
  { path: 'ausgsteckt', component: CurrentHeurigenComponent },
  { path: 'karte', component: MapsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'taxi', component: TaxiComponent },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
