import { Component, OnInit } from '@angular/core';
import { Taxi } from 'src/app/dtos/taxi';
import { DatabaseService } from 'src/app/services/database.service';
import { TaxiService } from 'src/app/services/taxi.service';

@Component({
  selector: 'app-taxi',
  templateUrl: './taxi.component.html',
  styleUrls: ['./taxi.component.scss']
})
export class TaxiComponent implements OnInit {
  constructor(
    public taxiService: TaxiService,
    private databaseService: DatabaseService
  ) {}

  taxi: Taxi[] = [];
  requestLoaded = false;

  ngOnInit() {
    this.taxiService.getTaxi().subscribe(
      (response: Taxi[]) => {
        this.taxi = response;
        this.databaseService.updateTaxi(response);
        this.requestLoaded = true;
      },
      (error) => {
        this.databaseService.getTaxi().subscribe(
          (response: Taxi[]) => {
            this.taxi = response;
            this.requestLoaded = true;
          }
        );
      }
    )
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
