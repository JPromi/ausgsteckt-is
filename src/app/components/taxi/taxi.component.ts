import { Component, OnInit } from '@angular/core';
import { Taxi } from 'src/app/dtos/taxi';
import { TaxiService } from 'src/app/services/taxi.service';

@Component({
  selector: 'app-taxi',
  templateUrl: './taxi.component.html',
  styleUrls: ['./taxi.component.scss']
})
export class TaxiComponent implements OnInit {
  constructor(
    public taxiService: TaxiService
  ) {}

  taxi: Taxi[] = [];
  requestLoaded = false;

  ngOnInit() {
    this.taxiService.getTaxi().subscribe(
      (response: Taxi[]) => {
        this.taxi = response;
        this.requestLoaded = true;
      },
      (error) => {
        this.requestLoaded = true;
      }
    )
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
