import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import cfg from '../../config.json';
import { Heuriger } from '../dtos/heuriger';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeurigerService {
  private url = cfg.api.url + cfg.api.version;
   
  constructor(private httpClient: HttpClient) {}
  
  getHeuriger(heurigerName:string): Observable<Heuriger> {
      return this.httpClient.get<Heuriger>(this.url +  '/heurigen?heurigen=' + heurigerName).pipe(
        timeout(cfg.api.timeout),
        catchError(e => {
          throw new Error('Timeout exceeded!');
        })
      );;
  }

  getHeurigenByDate(date:string = ''): Observable<Heuriger[]> {
    if(date) {
      return this.httpClient.get<Heuriger[]>(this.url + '/ausgesteckt?date=' + date).pipe(
        timeout(cfg.api.timeout),
        catchError(e => {
          throw new Error('Timeout exceeded!');
        })
      );;
    } else {
      return this.httpClient.get<Heuriger[]>(this.url + '/ausgesteckt').pipe(
        timeout(cfg.api.timeout),
        catchError(e => {
          throw new Error('Timeout exceeded!');
        })
      );;
    }
  }

  getAllHeurigen(all: boolean = false): Observable<Heuriger[]> {
    var parameter = '?';
    if(all) {
      parameter += 'data=all';
    }
    return this.httpClient.get<Heuriger[]>(this.url + '/heurigen' + parameter).pipe(
      timeout(cfg.api.timeout),
      catchError(e => {
        throw new Error('Timeout exceeded!');
      })
    );
  }
}
