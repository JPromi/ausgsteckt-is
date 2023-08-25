import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import cfg from '../../config.json';

@Injectable({
  providedIn: 'root'
})
export class AllHeurigenService {

  private url = cfg.api + cfg.apiVersion + '/heurigen';
   
  constructor(private httpClient: HttpClient) {}
  
  getPosts(){
      return this.httpClient.get(this.url);
  }
}
