import { Component, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
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

  public openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  public heurigenList: Heuriger[] = [new Heuriger(0, '', '', '', '', new coordinates(0, 0), false, '', '', new phone('', '') , '', 0, [new ausgsteckt('', '')])];
  public heurigenLoaded = false;

  constructor(
    public heurigerService: HeurigerService,
  ) {}

  ngOnInit(): void {
    this.loadHeurigen();
  }

  loadHeurigen() {
    this.heurigerService.getHeurigenByDate().subscribe(
      (response: Array<Heuriger>) => {
        this.heurigenList = response;
        this.heurigenLoaded = true
      }
    );
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
}
