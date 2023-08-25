import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import cfg from '../../config.json';

@Injectable({
  providedIn: 'root'
})
export class CurrentHeurigenService {
  private url = cfg.api + cfg.apiVersion + '/ausgesteckt';
   
  constructor(private httpClient: HttpClient) {}
  
  getPosts(date:string = ''){
    if(date) {
      return this.httpClient.get(this.url + '?date=' + date);
    } else {
      return this.httpClient.get(this.url);
    }
  }
}
