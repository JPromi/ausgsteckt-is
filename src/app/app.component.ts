import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { Settings } from './dtos/settings';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ausgstekt-app';

  settings: Settings = new Settings;

  constructor(
    private settingsSerive:SettingsService,
    private translate: TranslateService
  ) {
    translate.addLangs(['de-AT', 'en-US', 'at-VIE']);
    translate.setDefaultLang('de-AT');
    // translate.use('de-AT');
  }

  async ngOnInit() {
    await this.checkSetting();

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
    this.checkOS();
    if(!localStorage.length) {
      this.settingsSerive.saveSettings(this.settings);
    } else {
      this.settings = this.settingsSerive.getSettings();
    }

    this.settingsSerive.settings_darkmode();
    this.translate.use(this.settingsSerive.getSettings().language)
  }

  checkOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("iphone")) {
      document.getElementsByTagName("body")[0].classList.add("iOS");
      console.log("iPhone");
    }
  }

  
}