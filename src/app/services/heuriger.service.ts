import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import cfg from '../../config.json';
import { Heuriger } from '../dtos/heuriger';

@Injectable({
  providedIn: 'root'
})
export class HeurigerService {
  private url = cfg.api + cfg.apiVersion;
   
  constructor(private httpClient: HttpClient) {}
  
  getHeuriger(heurigerName:string): Observable<Heuriger> {
      return this.httpClient.get<Heuriger>(this.url +  '/heurigen?heurigen=' + heurigerName);
  }

  getHeurigenByDate(date:string = ''): Observable<Heuriger[]> {
    if(date) {
      return this.httpClient.get<Heuriger[]>(this.url + '/ausgesteckt?date=' + date);
    } else {
      return this.httpClient.get<Heuriger[]>(this.url + '/ausgesteckt');
    }
  }

  getAllHeurigen(): Observable<Heuriger[]> {
    return this.httpClient.get<Heuriger[]>(this.url + '/heurigen');
}
}
