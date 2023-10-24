import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllHeurigenComponent } from './components/all-heurigen/all-heurigen.component';
import { CurrentHeurigenComponent } from './components/current-heurigen/current-heurigen.component';
import { HeurigerComponent } from './components/heuriger/heuriger.component';
import { MapsComponent } from './components/maps/maps.component';
import { ErrorComponent } from './components/error/error.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TaxiComponent } from './components/taxi/taxi.component';

const title = "Ausgsteckt Is"

const routes: Routes = [
  { path: '', redirectTo: '/ausgsteckt', pathMatch: 'full' },
  { path: 'heurigen', component: AllHeurigenComponent, title: 'Heurigen - ' + title },
  { path: 'heurigen/:heuriger', component: HeurigerComponent },
  { path: 'event/:heuriger', component: HeurigerComponent },
  { path: 'ausgsteckt', component: CurrentHeurigenComponent, title: 'Ausgsteckt Heurigen - ' + title },
  { path: 'karte', component: MapsComponent, title: 'Karte - ' + title },
  { path: 'settings', component: SettingsComponent, title: 'Einstellungen - ' + title },
  { path: 'taxi', component: TaxiComponent, title: 'Taxi - ' + title },
  { path: '**', component: ErrorComponent, title: 'Error - ' + title },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
