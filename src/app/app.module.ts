import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllHeurigenComponent } from './components/all-heurigen/all-heurigen.component';
import { CurrentHeurigenComponent } from './components/current-heurigen/current-heurigen.component';
import { NavComponent } from './components/nav/nav.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    AllHeurigenComponent,
    CurrentHeurigenComponent,
    NavComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
