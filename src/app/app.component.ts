import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { Settings } from './dtos/settings';
import { TranslateService } from '@ngx-translate/core';
import cfg from '../config.json';
import { Router } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';
import { DatabaseService } from './services/database.service';
import { HeurigerService } from './services/heuriger.service';
import { Heuriger } from './dtos/heuriger';
import { TaxiService } from './services/taxi.service';
import { Taxi } from './dtos/taxi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ausgstekt-app';

  settings: Settings = new Settings;
  scriptLoaded: boolean = true;

  constructor(
    private settingsSerive:SettingsService,
    private translate: TranslateService,
    public router: Router,
    public databaseService: DatabaseService,
    private heurigenService: HeurigerService,
    private taxiService: TaxiService
  ) {
    translate.addLangs(['de-AT', 'en-US', 'fr-FR', 'uk-UA', 'at-VIE']);
    translate.setDefaultLang('de-AT');
    // translate.use('de-AT');
  }

  async ngOnInit() {
    await this.loadGoogleMapsScript();
    await this.checkSetting();
    await this.loadOfflineData();

    //backbutton Android
    CapacitorApp.addListener('backButton', ({canGoBack}) => {
      if(!canGoBack){
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });

    this.translate.use(this.settingsSerive.getSettings().language)

    // system darkmode
    window.matchMedia("(prefers-color-scheme: dark)").addListener(e => {
      this.settingsSerive.settings_darkmode();
    });

    // settings
    addEventListener("storage", () => {
      this.checkSetting();
    });
  }

  checkSetting() {
    if(!localStorage.length) {
      this.settingsSerive.saveSettings(this.settings);
    } else {
      this.settings = this.settingsSerive.getSettings();
    }

    this.settingsSerive.settings_darkmode();
    this.translate.use(this.settingsSerive.getSettings().language)
  }

  async loadGoogleMapsScript() {
    localStorage.setItem("googleMapsScriptLoaded", "false")
    if(!document.getElementById("googleMapsApiScript")) {
      var scriptLanguage = "de-AT";
      switch(localStorage.getItem("language")) {
        case 'de-AT':
          scriptLanguage = "de"
          break;

        case 'at-VIE':
          scriptLanguage = "de"
          break;
    
        case 'en-US':
          scriptLanguage = "en"
          break;

        case 'fr-FR':
          scriptLanguage = "fr"
          break;
        
        case 'uk-UA':
          scriptLanguage = "uk"
          break;

        default:
          scriptLanguage = "at"
          break;
      }
        let scriptEle = document.createElement("script");
        scriptEle.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=" + cfg.googleMapsAPIkey + "&callback=Function.prototype&language=" + scriptLanguage);
        // scriptEle.setAttribute("src", "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=Function.prototype");
        scriptEle.setAttribute("id", "googleMapsApiScript");
        document.body.appendChild(scriptEle);
        // scriptEle.addEventListener("load",
        //   () => {
        //     // this.scriptLoaded = true;
        //     console.log(this.scriptLoaded)
        //   }
        // );
        scriptEle.onload = () => {
          this.scriptLoaded = true;
          localStorage.setItem("googleMapsScriptLoaded", "true")
        }
        scriptEle.onerror = () => {
          localStorage.setItem("googleMapsScriptLoaded", "error")
        }
    }
  }

  loadOfflineData() {
    // heurigen
    if(localStorage.getItem('database_heurigen_update')) {
      var lastHeurigenUpdate = new Date(localStorage.getItem('database_heurigen_update') || "");
    } else {
      var lastHeurigenUpdate = new Date(localStorage.getItem('database_heurigen_update') || "2000-01-01");
    }
    if(!this.isToday(lastHeurigenUpdate)) {
      this.heurigenService.getAllHeurigen()
      .subscribe((response: Heuriger[]) => {
        this.databaseService.updateHeurigen(response);
      },
      (error) => {}
      );
    }

    // taxi
    // heurigen
    if(localStorage.getItem('database_taxi_update')) {
      var lastTaxiUpdate = new Date(localStorage.getItem('database_taxi_update') || "");
    } else {
      var lastTaxiUpdate = new Date(localStorage.getItem('database_taxi_update') || "2000-01-01");
    }
    if(!this.isToday(lastTaxiUpdate)) {
      this.taxiService.getTaxi()
      .subscribe((response: Taxi[]) => {
        this.databaseService.updateTaxi(response);
      },
      (error) => {}
      );
    }
  }

  private isToday(date: Date): boolean {
    var today = new Date()
    if(date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()) {
      return true;
    } else {
      return false;
    }
  }

  
}