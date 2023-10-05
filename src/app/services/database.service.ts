import { Injectable } from '@angular/core';
import { Heuriger, ausgsteckt, coordinates, phone } from '../dtos/heuriger';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    if(localStorage.getItem('database_update')) {
      var lastUpdate = new Date(localStorage.getItem('database_update') || "");
    } else {
      var lastUpdate = new Date(localStorage.getItem('database_update') || "2000-01-01");
    }
    
    //run updat only if last update was not today
    if(!this.isToday(lastUpdate)) {
      heurigen.forEach(async heuriger => {
        await this.dbService.add('heurigen', heuriger).subscribe(
          (res) => {
            localStorage.setItem('database_update', new Date().toString());
          },
          (error) => {
          }
        )
      });
    }
  }

  getHeurigen(): Observable<Heuriger[]> {
    return this.dbService.getAll('heurigen')
  }

  getHeuriger(heurigerId: string): Observable<Heuriger> {
    return this.dbService.getByKey('heurigen', heurigerId);
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
}
