import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllHeurigenComponent } from './components/all-heurigen/all-heurigen.component';
import { CurrentHeurigenComponent } from './components/current-heurigen/current-heurigen.component';
import { HeurigerComponent } from './components/heuriger/heuriger.component';

const routes: Routes = [
  { path: '', redirectTo: '/ausgsteckt', pathMatch: 'full' },
  { path: 'heurigen', component: AllHeurigenComponent },
  { path: 'heurigen/:heuriger', component: HeurigerComponent },
  { path: 'ausgsteckt', component: CurrentHeurigenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
