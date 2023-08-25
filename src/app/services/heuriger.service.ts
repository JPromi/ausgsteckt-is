import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import cfg from '../../config.json';

@Injectable({
  providedIn: 'root'
})
export class HeurigerService {
  private url = cfg.api + cfg.apiVersion + '/heurigen';
   
  constructor(private httpClient: HttpClient) {}
  
  getHeuriger(heurigerName:string){
      return this.httpClient.get(this.url +  '?heurigen=' + heurigerName);
  }
}
