import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import cfg from '../../config.json';
import { Taxi } from '../dtos/taxi';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaxiService {
  private url = cfg.api.url + cfg.api.version;

  constructor(private httpClient: HttpClient) { }

  getTaxi(): Observable<Taxi[]> {
    return this.httpClient.get<Taxi[]>(this.url +  '/taxi').pipe(
      timeout(cfg.api.timeout),
      catchError(e => {
        throw new Error('Timeout exceeded!');
      })
    );;
}
}
