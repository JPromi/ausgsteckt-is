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
    translate.addLangs(['de-DE', 'en-US']);
    translate.setDefaultLang('de-DE');
    translate.use('de-DE');
  }

  async ngOnInit() {
    await this.checkSetting();

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
  }

  
}