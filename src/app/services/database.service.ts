import { Injectable } from '@angular/core';
import { Heuriger, ausgsteckt, coordinates, phone } from '../dtos/heuriger';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Taxi } from '../dtos/taxi';
import { HeurigerFavourite } from '../dtos/heuriger-favourite';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private httpClient: HttpClient,
    private dbService: NgxIndexedDBService
  ) { }

  updateHeurigen(heurigen: Heuriger[]) {

    //check if last update isset
    if(localStorage.getItem('database_heurigen_update')) {
      var lastUpdate = new Date(localStorage.getItem('database_heurigen_update') || "");
    } else {
      var lastUpdate = new Date(localStorage.getItem('database_heurigen_update') || "2000-01-01");
    }
    
    //run updat only if last update was not today
    if(!this.isToday(lastUpdate)) {
      heurigen.forEach(async heuriger => {
        await this.dbService.clear('heurigen').subscribe(
          async () => {
            await this.dbService.add('heurigen', heuriger).subscribe(
              (res) => {
                localStorage.setItem('database_heurigen_update', new Date().toString());
              },
              (error) => {
                console.error(error)
              }
            )
          },
          (error) => {
            console.error(error)
          }
        );
      });
    }
  }

  getHeurigen(): Observable<Heuriger[]> {
    return this.dbService.getAll('heurigen')
  }

  getHeuriger(heurigerId: string): Observable<Heuriger> {
    return this.dbService.getByKey('heurigen', heurigerId);
  }

  updateTaxi(taxis: Taxi[]) {
    //check if last update isset
    if(localStorage.getItem('database_taxi_update')) {
      var lastUpdate = new Date(localStorage.getItem('database_taxi_update') || "");
    } else {
      var lastUpdate = new Date(localStorage.getItem('database_taxi_update') || "2000-01-01");
    }

    //run updat only if last update was not today
    if(!this.isToday(lastUpdate)) {
      taxis.forEach(async taxi => {
        await this.dbService.add('taxi', taxi).subscribe(
          (res) => {
            localStorage.setItem('database_taxi_update', new Date().toString());
          },
          (error) => {
            console.log(error)
          }
        )
      });
    }
  }

  getTaxi(): Observable<Taxi[]> {
    return this.dbService.getAll('taxi');
  }

  private isToday(date: Date): boolean {
    var today = new Date()
    if(date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()) {
      return true;
    } else {
      return false;
    }
  }

  getHeurigenFavourites(): Observable<HeurigerFavourite[]> {
    return this.dbService.getAll('favourites_heurigen')
  }

  getSingleHeurigenFavourites(heurigerName: string): Observable<HeurigerFavourite> {
    return this.dbService.getByKey('favourites_heurigen', heurigerName)
  }

  heurigenFavouritesToggle(heurigerName: string): void {
    this.dbService.getByKey('favourites_heurigen', heurigerName).subscribe(
      (response) => {
        if(response) {
          this.dbService.delete('favourites_heurigen', heurigerName).subscribe();
          return false
        } else {
          this.dbService.add('favourites_heurigen', new HeurigerFavourite(heurigerName, true)).subscribe();
          return true
        }
      }
    );
  }
}
