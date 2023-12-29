import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Heuriger, ausgsteckt, coordinates, phone } from 'src/app/dtos/heuriger';
import { EmptyObjectService } from 'src/app/services/empty-object.service';
import { HeurigerService } from 'src/app/services/heuriger.service';
import { LanguageService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';

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
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#523735"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c9b2a6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#dcd2be"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ae9e90"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          {
            visibility: "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#93817c"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a5b076"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#447530"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fdfcf8"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f8c967"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#e9bc62"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e98d58"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#db8555"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#806b63"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "label",
        "stylers": [
          {
            visibility: "off"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8f7d77"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b9d3c2"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#92998d"
          }
        ]
      }
    ],
    fullscreenControl: false,

    center: { lat: 48.1227629, lng: 16.2609432},
    zoom: 14,
  }

  public heurigenList: Heuriger[] = [this.emptyObjectService.heuriger()];
  public heurigenLoaded = false;
  public currentLocation = {
    "allowed": false,
    "lat": 0,
    "lng": 0
  }
  public selectedHeuriger: Heuriger = this.emptyObjectService.heuriger();

  currentHeurigen:any;
  parameter:any;
  dateDisplay:any;
  selectedDate = new FormControl('');
  searchByDate = true;
  error = false;
  scriptLoaded: boolean = false;

  constructor(
    public heurigerService: HeurigerService, 
    public settingsService: SettingsService,
    public emptyObjectService: EmptyObjectService,
    private route: ActivatedRoute, 
    private router: Router,
    private languageService: LanguageService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.route.queryParams.subscribe(response => {
      this.parameter = response;
    }
    );

    this.datePickerLanguage();
  }

  ngOnInit(dateP = '') {    
    setTimeout(() => {
      this.checkMapsScript();
    }, 200);

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

    // darkmode
    this.mapsDarkmode();
    // this.addCurrentPositin();

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
          var currentDate: Date;
  
          if(!this.parameter.date) {
            currentDate = new Date();
            this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
          } else {
            const currentDateT = Date.parse(this.parameter.date);
            currentDate = new Date(currentDateT);
            this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
          }
          for (let i = 0; i < this.heurigenList.length; i++) {
            this.heurigenList[i].daysRemain = this.daysRemain(this.heurigenList[i], currentDate)
          }
        },
        (error) => {
          this.error = true;
        }
      );
    } else {
      this.heurigerService.getAllHeurigen().subscribe(
        (response: Array<Heuriger>) => {
          var _heurigenList: Heuriger[] = [];
          response.forEach(heuriger => {
            if(heuriger.type == 'weinrat' || heuriger.type == 'heuriger') {
              _heurigenList.push(heuriger);
            }
          });
          this.heurigenList = _heurigenList;
          console.log(this.heurigenList);
          this.heurigenLoaded = true;
        },
        (error) => {
          this.error = true;
        }
      );
    }
    
  }

  daysRemain(heuriger: Heuriger, date: Date = new Date()): number {
    const today = date;
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

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  generateMapsLink(heuriger: Heuriger) {
    var url = "http://maps.google.com/maps?q=";
    return url + heuriger.address.replace(" ", "+") + ',' +  '+' + heuriger.city.replace(" ", "+");
  }

  generateMarkerIcon(iconUrl: string): google.maps.MarkerOptions {
    var retrun: google.maps.MarkerOptions = {
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(40, 55)
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

  mapsDarkmode() {
    if(this.settingsService.checkDarkmode()) {
      this.mapOptions.styles = [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#181818"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1b1b1b"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#2c2c2c"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8a8a8a"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3c3c3c"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#4e4e4e"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3d3d3d"
            }
          ]
        }
      ];

    }
  }

  addCurrentPositin() {
    navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation.lat = position.coords.latitude;
        this.currentLocation.lng = position.coords.longitude;
        this.currentLocation.allowed = true;
      }
    )

  }

  getCurrentLocationOptions(): google.maps.MarkerOptions {
    var retrun: google.maps.MarkerOptions = {
      icon: {
        url: "/assets/images/location.png",
        scaledSize: new google.maps.Size(20, 20)
      }
    }
    return retrun; 
  }

  @HostListener('window:storage', ['$event'])
  checkMapsScript() {
    if(localStorage.getItem("googleMapsScriptLoaded") == "true") {
      this.scriptLoaded = true;
    } else if(localStorage.getItem("googleMapsScriptLoaded") == "error") {
      this.error = true;
    }
  }

  generateSingleViewLink(heuriger: Heuriger): string {
    if(heuriger.type == 'event') {
      return '/event/' + heuriger.nameId
    } else {
      return '/heurigen/' + heuriger.nameId
    }
  }

  datePickerLanguage() {
    this.dateAdapter.setLocale(this.languageService.getCurrentLanguage().realCode);
  }

  openHeurigenInfo(heuriger: Heuriger) {
    this.selectedHeuriger = heuriger;
    console.log(this.selectedHeuriger);
  }

  closeHeurigenInfo() {
    this.selectedHeuriger = this.emptyObjectService.heuriger();
  }
}
