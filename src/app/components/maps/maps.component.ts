import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Heuriger, ausgsteckt, coordinates, phone } from 'src/app/dtos/heuriger';
import { HeurigerService } from 'src/app/services/heuriger.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeId: 'roadmap',
    minZoom: 7,
    styles: [
      {
          featureType: "poi",
          elementType: "labels",
          stylers: [
                { visibility: "off" }
          ]
      },
    ],
    // fullscreenControl: false,

    center: { lat: 48.1227629, lng: 16.2609432},
    zoom: 14,
  }

  public heurigenList: Heuriger[] = [new Heuriger(0, '', '', '', '', new coordinates(0, 0), false, '', '', new phone('', '') , '', 0, [new ausgsteckt('', '')])];
  public heurigenLoaded = false;

  currentHeurigen:any;
  parameter:any;
  dateDisplay:any;
  selectedDate = new FormControl('');
  searchByDate = true;

  constructor(
    public heurigerService: HeurigerService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.route.queryParams.subscribe(response => {
      this.parameter = response;
    }
    );
  }

  ngOnInit(dateP = ''): void {
    var parameter = '';
    if(dateP == '') {
      if(!this.parameter.date) {
        const currentDate = new Date();
        parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' + this.checkDateZero(currentDate.getDate());
      } else {
        const currentDateT = Date.parse(this.parameter.date);
        const currentDate = new Date(currentDateT);
        parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' +this.checkDateZero(currentDate.getDate());
      }
    } else {
      parameter = dateP;
    }   

    this.loadHeurigen(parameter);

    if(!this.parameter.date) {
      const currentDate = new Date();
      this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
    } else {
      const currentDateT = Date.parse(this.parameter.date);
      const currentDate = new Date(currentDateT);
      this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
    }
  }

  loadHeurigen(parameter:any) {
    if(this.searchByDate) {
      this.heurigerService.getHeurigenByDate(parameter).subscribe(
        (response: Array<Heuriger>) => {
          this.heurigenList = response;
          this.heurigenLoaded = true;
  
          if(!this.parameter.date) {
            const currentDate = new Date();
            this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
          } else {
            const currentDateT = Date.parse(this.parameter.date);
            const currentDate = new Date(currentDateT);
            this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
          }
        }
      );
    } else {
      this.heurigerService.getAllHeurigen().subscribe(
        (response: Array<Heuriger>) => {
          this.heurigenList = response;
          this.heurigenLoaded = true;
        }
      );
    }
    
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  generateMapsLink(heuriger: Heuriger) {
    var url = "http://maps.google.com/maps?t=h&q=";
    return url + heuriger.address.replace(" ", "+") + ',' +  '+' + heuriger.city.replace(" ", "+");
  }

  generateMerkerIcon(iconUrl: string): google.maps.MarkerOptions {
    var retrun: google.maps.MarkerOptions = {
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(35, 50)
      }
    }
    return retrun; 
  }

  changeSearchType() {
    if(this.searchByDate) {
      this.searchByDate = false;
    } else {
      this.searchByDate = true;
    }
    this.loadHeurigen('');
  }

  // date
  async lastDate() {
    if(!this.parameter.date) {
      var parameter = '';
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      parameter = await currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' + this.checkDateZero(currentDate.getDate());
    } else {
      const currentDateT = Date.parse(this.parameter.date);
      const currentDate = new Date(currentDateT);
      currentDate.setDate(currentDate.getDate() - 1);
      parameter = await currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' +this.checkDateZero(currentDate.getDate());
    }
    
    this.router.navigate(['/karte'], { queryParams: { date: parameter}});
    
    
    this.loadHeurigen(parameter);
  }

  nextDate() {    
    if(!this.parameter.date) {
      var parameter = '';
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' + this.checkDateZero(currentDate.getDate());
    } else {
      const currentDateT = Date.parse(this.parameter.date);
      const currentDate = new Date(currentDateT);
      currentDate.setDate(currentDate.getDate() + 1);
      parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' +this.checkDateZero(currentDate.getDate());
    }

    this.router.navigate(['/karte'], { queryParams: { date: parameter}});
    
    
    this.ngOnInit(parameter);
  }

  specificDate(event: any) {
    const currentDateT = event.target.value;
    const currentDate = new Date(currentDateT);
    var parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' +this.checkDateZero(currentDate.getDate());

    this.router.navigate(['/karte'], { queryParams: { date: parameter}});
    
    
    this.ngOnInit(parameter);
  }

  checkDateZero(number:number):String {
    let dateNumber = number.toString();
    if(number < 10) {
      dateNumber = '0' + number.toString();
    }

    return dateNumber;
  }
}
