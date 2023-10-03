import { Injectable } from '@angular/core';
import { Settings } from '../dtos/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  saveSettings(settings: Settings) {
    localStorage.setItem('systemTheme', settings.systemTheme ? "true" : "false");
    localStorage.setItem('darkmode', settings.darkmode ? "true" : "false");
  }

  getSettings(): Settings {
    if(localStorage.length > 0) {
      return new Settings(
        this.strinToBoolean(localStorage.getItem('systemTheme') || ''),
        this.strinToBoolean(localStorage.getItem('darkmode') || ''),
      )
    } else {
      return new Settings;
    }
    
  }

  reloadSettings(option: String = 'all') {
    if(option == 'all') {
      this.settings_darkmode();
    }
  }

  private strinToBoolean(string: String) {
    if(string == 'true') {
      return true;
    } else {
      return false;
    }
  }

  settings_darkmode() {
    if(this.getSettings().systemTheme) {

      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.getElementsByTagName("body")[0].classList.add("darkmode");
      } else {
        document.getElementsByTagName("body")[0].classList.remove("darkmode");
      }

    } else {

      if(this.getSettings().darkmode) {
        document.getElementsByTagName("body")[0].classList.add("darkmode");
      } else {
        document.getElementsByTagName("body")[0].classList.remove("darkmode");
      }

    }
  }

  checkDarkmode(): boolean {
    if(this.getSettings().systemTheme) {

      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      } else {
        return false;
      }

    } else {

      if(this.getSettings().darkmode) {
        return true;
      } else {
        return false;
      }

    }
  }
}
