import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AllHeurigenService {

  private url = 'https://api.jpromi.com/perchtoldsdorf/heurigen/v2/heurigen';
   
  constructor(private httpClient: HttpClient) {}
  
  getPosts(){
      return this.httpClient.get(this.url);
  }
}
