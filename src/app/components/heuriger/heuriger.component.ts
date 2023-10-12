import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { HeurigerService } from "../../services/heuriger.service";
import { Heuriger, ausgsteckt, coordinates, phone } from 'src/app/dtos/heuriger';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateService } from '@ngx-translate/core';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-heuriger',
  templateUrl: './heuriger.component.html',
  styleUrls: ['./heuriger.component.scss']
})
export class HeurigerComponent {

  heuriger:Heuriger = new Heuriger(0, '', '', false, '', '', new coordinates(0, 0), false, false, '', '', new phone('', '') , '', 0, [new ausgsteckt('', '')]);
  mapsLink:string = "";
  heurigerLoading = false;

  constructor(
    private heurigenService:HeurigerService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private databaseService: DatabaseService,
    private translate: TranslateService
  ) {
    
  }

  ngOnInit() {
    this.loadContent();
  }

  async loadContent(): Promise<Object> {
    this.heurigerLoading = true;
    return this.route.params.subscribe(async heuriger => {
      ((this.heurigenService.getHeuriger(heuriger["heuriger"])))
      .subscribe((response: Heuriger) => {
        if(!response["id"]) {
          this.router.navigateByUrl("/heurigen");
          return null;
        }
        this.heuriger = response;
        this.heurigerLoading = false;
        this.getFavourite();
        this.generateMapsLink();
        return heuriger["heuriger"];
      },
      (err) => {
        this.databaseService.getHeuriger(heuriger["heuriger"]).subscribe(
          (responseDB: Heuriger) => {
            responseDB.daysRemain = this.daysRemain(responseDB);
            this.heuriger = responseDB;
            this.heurigerLoading = false;
            this.getFavourite();
            this.generateMapsLink();
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

    return dateConvert.getDate() + "." + (dateConvert.getMonth() + 1)  + "." + dateConvert.getFullYear();
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

  async share() {
    var shareData = {
      title: this.heuriger.name,
      text: `
${this.heuriger.name}

📍 ${this.heuriger.address}, ${this.heuriger.city}
📞 ${this.heuriger.phone.main}
📧 ${this.heuriger.email}
🌍 ${this.heuriger.link}

${this.translate.instant('heuriger.dates.title')}
`
    }

    var today = new Date();

    for (let i = 0; i < this.heuriger.ausgsteckt.length; i++) {
      var heurigenEnd = new Date(this.heuriger.ausgsteckt[i].to);
      if(heurigenEnd >= today) {
        shareData.text += `
${this.convertDate(this.heuriger.ausgsteckt[i].from)} - ${this.convertDate(this.heuriger.ausgsteckt[i].to)}`;
      }

      
    }
    
    // navigator.share(shareData);
    try {
      await Share.share(shareData);
    } catch (error) {
      console.error('Fehler beim Teilen: ', error);
    }
  }

}
