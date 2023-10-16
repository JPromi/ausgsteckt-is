import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { Settings } from './dtos/settings';
import { TranslateService } from '@ngx-translate/core';
import cfg from '../config.json';
import { Router } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';

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
    public router: Router
  ) {
    translate.addLangs(['de-AT', 'en-US', 'fr-FR', 'uk-UA', 'at-VIE']);
    translate.setDefaultLang('de-AT');
    // translate.use('de-AT');
  }

  async ngOnInit() {
    await this.loadGoogleMapsScript();
    await this.checkSetting();

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
        let scriptEle = document.createElement("script");
        scriptEle.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=" + cfg.googleMapsAPIkey + "&callback=Function.prototype");
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

  
}