import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Heuriger } from 'src/app/dtos/heuriger';
import { DatabaseService } from 'src/app/services/database.service';
import { HeurigerService } from 'src/app/services/heuriger.service';



@Component({
  selector: 'app-all-heurigen',
  templateUrl: './all-heurigen.component.html',
  styleUrls: ['./all-heurigen.component.scss']
})
export class AllHeurigenComponent {

  heurigen:any;
  parameter:any;
  requestLoaded:boolean = false;
  error:boolean = false

  constructor(private heurigenService:HeurigerService, private route: ActivatedRoute, private router: Router, private databaseService: DatabaseService) {

    this.route.queryParams.subscribe(response => {
      this.parameter = response;
    }
    );
  }

  ngOnInit() {
    this.heurigenService.getAllHeurigen()
      .subscribe((response: Heuriger[]) => {
        this.heurigen = response;
        this.requestLoaded = true;
        this.databaseService.updateHeurigen(response);
      },
      (error) => {
        this.error = true;
        this.databaseService.getHeurigen().subscribe(
          (responseDB: Heuriger[]) => {
            this.heurigen = responseDB;
            this.requestLoaded = true;
          },
          (error) => {
            this.requestLoaded = true;
          }
        );
      }
    );
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
