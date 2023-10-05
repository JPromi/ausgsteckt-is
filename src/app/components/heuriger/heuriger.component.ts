import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { HeurigerService } from "../../services/heuriger.service";
import { Heuriger } from 'src/app/dtos/heuriger';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-heuriger',
  templateUrl: './heuriger.component.html',
  styleUrls: ['./heuriger.component.scss']
})
export class HeurigerComponent {

  heuriger:any = "";
  mapsLink:string = "";

  constructor(private heurigenService:HeurigerService, private route: ActivatedRoute, private router: Router, private _location: Location, private databaseService: DatabaseService) {
    
  }

  ngOnInit() {
    this.loadContent();
  }

  async loadContent(): Promise<Object> {
    return this.route.params.subscribe(async heuriger => {
      ((this.heurigenService.getHeuriger(heuriger["heuriger"])))
      .subscribe((response: Heuriger) => {
        if(!response["id"]) {
          this.router.navigateByUrl("/heurigen");
          return null;
        }
        this.heuriger = response;
        this.generateMapsLink();
        return heuriger["heuriger"];
      },
      (err) => {
        this.databaseService.getHeuriger(heuriger["heuriger"]).subscribe(
          (responseDB: Heuriger) => {
            this.heuriger = responseDB;
          }
        )
      }
      )
      ;
    });
  }

  generateMapsLink() {
    var url = "http://maps.google.com/maps?t=h&q=";
    this.mapsLink = url + this.heuriger.address.replace(" ", "+") + ',' +  '+' + this.heuriger.city.replace(" ", "+");
  }

  convertDate(date: string) {
    var dateConvert = new Date(date);

    return dateConvert.getDate() + "." + dateConvert.getMonth() + "." + dateConvert.getFullYear();
  }

  backClick() {
    this._location.back();
  }

}
