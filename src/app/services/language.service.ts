import { Injectable } from '@angular/core';
import { Language } from '../dtos/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor() { }

  private languages = [
    {
      "name": "Deutsch",
      "code": "de-AT",
      "realCode": "de",
      "flag": "austria"
    },
    {
      "name": "English",
      "code": "en-US",
      "realCode": "en",
      "flag": "america"
    },
    {
      "name": "Français",
      "code": "fr-FR",
      "realCode": "fr",
      "flag": "france"
    },
    {
      "name": "українська",
      "code": "uk-UA",
      "realCode": "uk",
      "flag": "ukraine"
    },
    {
      "name": "Wienerisch",
      "code": "at-VIE",
      "realCode": "de",
      "flag": "vienna"
    },
    {
      "name": "Hrvatski",
      "code": "hr-HR",
      "realCode": "hr",
      "flag": "croatia"
    },
  ]

  getLanguages(): Language[] {
    return this.languages.sort((a, b) => a.name.localeCompare(b.name));
  }

  getLanguageByCode(code: string): Language {
    return this.languages.find(language => language.code === code) || this.languages[0];
  }

  getCurrentLanguage(): Language {
    return this.getLanguageByCode(localStorage.getItem('language') || 'de') || this.languages[0];
  }
}
