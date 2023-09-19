import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { HeurigerService } from "../../services/heuriger.service";

@Component({
  selector: 'app-heuriger',
  templateUrl: './heuriger.component.html',
  styleUrls: ['./heuriger.component.scss']
})
export class HeurigerComponent {

  heuriger:any = "";
  mapsLink:string = "";

  constructor(private service:HeurigerService, private route: ActivatedRoute, private router: Router) {
    
  }

  ngOnInit() {
    this.loadContent();
  }

  async loadContent(): Promise<Object> {
    return this.route.params.subscribe(async heuriger => {
      ((this.service.getHeuriger(heuriger["heuriger"])))
      .subscribe((response: any) => {
        if(!response["id"]) {
          this.router.navigateByUrl("/heurigen");
          return null;
        }
        this.heuriger = response;
        this.generateMapsLink();
        return heuriger["heuriger"];
      })
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

}
