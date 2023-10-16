import { Injectable } from '@angular/core';
import { Heuriger, ausgsteckt, coordinates, phone } from '../dtos/heuriger';

@Injectable({
  providedIn: 'root'
})
export class EmptyObjectService {

  constructor() { }

  heuriger(): Heuriger {
    return new Heuriger(0, '', '', false, '', '', new coordinates(0, 0), false, false, false, false, '', '', new phone('', '') , '', 0, [new ausgsteckt('', '')])
  }
}
