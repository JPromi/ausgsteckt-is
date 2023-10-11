import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { HeurigerService } from "../../services/heuriger.service";
import { Heuriger, ausgsteckt, coordinates, phone } from 'src/app/dtos/heuriger';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-heuriger',
  templateUrl: './heuriger.component.html',
  styleUrls: ['./heuriger.component.scss']
})
export class HeurigerComponent {

  heuriger:Heuriger = new Heuriger(0, '', '', false, '', '', new coordinates(0, 0), false, '', '', new phone('', '') , '', 0, [new ausgsteckt('', '')]);
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
        this.getFavourite();
        this.generateMapsLink();
        return heuriger["heuriger"];
      },
      (err) => {
        this.databaseService.getHeuriger(heuriger["heuriger"]).subscribe(
          (responseDB: Heuriger) => {
            responseDB.daysRemain = this.daysRemain(responseDB);
            this.heuriger = responseDB;
            this.getFavourite();
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

  daysRemain(heuriger: Heuriger): number {
    const today = new Date();
    var returnValue = 0;

    for (const date of heuriger.ausgsteckt) {
      const startDate = new Date(date.from);
      const endDate = new Date(date.to);

      if (today >= startDate && today <= endDate) {
        const diffTime = Math.abs(endDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
        break;
      }
    }

    return returnValue;
  }

  getFavourite() {
    this.databaseService.getSingleHeurigenFavourites(this.heuriger.nameId).subscribe(
      (favourite) => {
        if(favourite && favourite.favourite) {
          this.heuriger.favourite = true;
        }
      }
    );
  }

  toggleFavourite() {
    if(this.heuriger.favourite) {
      this.heuriger.favourite = false;
    } else {
      this.heuriger.favourite = true;
    }

    this.databaseService.heurigenFavouritesToggle(this.heuriger.nameId)
  }

}
