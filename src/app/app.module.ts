import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllHeurigenComponent } from './components/all-heurigen/all-heurigen.component';
import { CurrentHeurigenComponent } from './components/current-heurigen/current-heurigen.component';
import { NavComponent } from './components/nav/nav.component';

import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

import { HttpClientModule } from '@angular/common/http';
import { HeurigerComponent } from './components/heuriger/heuriger.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapsComponent } from './components/maps/maps.component';
import { ErrorComponent } from './components/error/error.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TaxiComponent } from './components/taxi/taxi.component';

const heurigenDbConfig: DBConfig  = {
  name: 'heurigen',
  version: 2,
  objectStoresMeta: [
    {
      store: 'taxi',
      storeConfig: { keyPath: 'nameId', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'nameId', keypath: 'nameId', options: { unique: true } },
        { name: 'phone', keypath: 'phone', options: { unique: false } },
        { name: 'website', keypath: 'website', options: { unique: false } },
      ]
    },
    {
      store: 'heurigen',
      storeConfig: { keyPath: 'nameId', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'nameId', keypath: 'nameId', options: { unique: true } },
        { name: 'address', keypath: 'address', options: { unique: false } },
        { name: 'city', keypath: 'city', options: { unique: false } },
        { name: 'coordinates[]', keypath: 'coordinates', options: { unique: false } },
        { name: 'playground', keypath: 'playground', options: { unique: false } },
        { name: 'link', keypath: 'link', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: false } },
        { name: 'phone[]', keypath: 'phone[]', options: { unique: false } },
        { name: 'type', keypath: 'type', options: { unique: false } },
        { name: 'daysRemain', keypath: 'daysRemain', options: { unique: false } },
        { name: 'ausgsteckt', keypath: 'ausgsteckt', options: { unique: false } },
      ]
    }
    
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    AllHeurigenComponent,
    CurrentHeurigenComponent,
    NavComponent,
    HeurigerComponent,
    MapsComponent,
    ErrorComponent,
    SettingsComponent,
    TaxiComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    NgxIndexedDBModule.forRoot(heurigenDbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
