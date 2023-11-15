import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Settings } from 'src/app/dtos/settings';
import { SettingsService } from 'src/app/services/settings.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/dtos/language';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { SettingsConfirmComponent } from 'src/app/components/settings-confirm/settings-confirm.component';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    public settingsService: SettingsService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    private translate: TranslateService,
    private dbService: NgxIndexedDBService,
    private languageService: LanguageService
  ) {}

  languages = [
    {
      "name": "Deutsch",
      "code": "de-AT",
      "realCode": "de",
      "flag": "austria"
    }
  ]

  settings = new Settings();
  clickCount = 0;
  // settingsForm = new FormGroup(
  //   {
  //     systemTheme: new FormControl<boolean>(this.settings.systemTheme),
  //     darkmode: new FormControl<boolean>(this.settings.darkmode)
  //   }
  // );

  settingsForm: FormGroup = this.formBuilder.group({
    systemTheme: [this.settings.systemTheme],
    darkmode: [this.settings.darkmode]
  });

  envInfo = environment.informations;

  ngOnInit() {
    this.loadLanguages();
    this.loadSettings();
  }

  loadSettings() {
    this.settings = this.settingsService.getSettings();
    this.settingsForm.setValue(
      {
        systemTheme: this.settings.systemTheme,
        darkmode: this.settings.darkmode
      }
    );
  }

  updateSettings() {
    this.settingsService.saveSettings(this.settings);
    this.settingsService.reloadSettings();
  }

  specialMode(type: string = 'invert') {
    this.clickCount++;

    setTimeout(() => {
        this.clickCount = 0;
    }, 1500)

    if(type == 'invert') {
      if (this.clickCount == 5) {
        this.clickCount = 0;
        document.getElementsByTagName("body")[0].classList.toggle("invert");
      }
    } else if(type == 'LSD') {
      if (this.clickCount == 5 && this.settingsService.checkDarkmode() && this.settings.language == 'at-VIE') {
        this.clickCount = 0;
        document.getElementsByTagName("body")[0].classList.toggle("LSD");
      }
    }
  }

  setLanguage(language: string) {
    this.settings.language = language;
    this.translate.use(language)
    this.updateSettings();
  }

  getLanguage(code: string): Language {
    for(var i = 0; i < this.languages.length; i++) {
      if(this.languages[i]["code"] == code){
          return this.languages[i];
      }
    }
    return new Language;
  }

  @ViewChild(MatMenuTrigger)
  trigger!: MatMenuTrigger;
  someMethod() {
    this.trigger.openMenu();
  }

  resetStorage(type: string) {
    var deleteData = false;
    let dialogRef = this.dialog.open(SettingsConfirmComponent, {
      data: {
        deleteType: type,
        deleteData: deleteData
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(type == 'favourites') {
          this.dbService.clear("favourites_heurigen").subscribe();
        } else if(type == 'heurigen') {
          this.dbService.clear("heurigen").subscribe();
          localStorage.removeItem("database_heurigen_update");
        } else if(type == 'notes') {
          this.dbService.clear("notes_heurigen").subscribe();
          localStorage.removeItem("notes_heurigen");
        } else if(type == 'taxi') {
          this.dbService.clear("taxi").subscribe();
          localStorage.removeItem("database_taxi_update");
        } else if(type == 'cache') {
          this.dbService.clear("heurigen").subscribe();
          localStorage.removeItem("database_heurigen_update");
          this.dbService.clear("taxi").subscribe();
          localStorage.removeItem("database_taxi_update");
        } else {
          this.dbService.clear("heurigen").subscribe();
          localStorage.removeItem("database_heurigen_update");
          this.dbService.clear("favourites_heurigen").subscribe();
          this.dbService.clear("notes_heurigen").subscribe();
          this.dbService.clear("taxi").subscribe();
          localStorage.removeItem("database_taxi_update");
        }
      }
    });
  }

  loadLanguages() {
    this.languages = this.languageService.getLanguages();
  }

}