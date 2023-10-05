import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import cfg from '../../config.json';
import { Taxi } from '../dtos/taxi';

@Injectable({
  providedIn: 'root'
})
export class TaxiService {
  private url = cfg.api + cfg.apiVersion;

  constructor(private httpClient: HttpClient) { }

  getTaxi(): Observable<Taxi[]> {
    return this.httpClient.get<Taxi[]>(this.url +  '/taxi');
}
}
