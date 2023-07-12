import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurrentHeurigenService {
  private url = 'https://api.jpromi.com/perchtoldsdorf/heurigen/v2/ausgesteckt';
   
  constructor(private httpClient: HttpClient) {}
  
  getPosts(date:string = ''){
    if(date) {
      return this.httpClient.get(this.url + '?date=' + date);
    } else {
      return this.httpClient.get(this.url);
    }
  }
}
