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
    private dbService: NgxIndexedDBService
  ) {}

  languages = [
    {
      "name": "Deutsch",
      "code": "de-AT",
      "flag": "austria"
    },
    {
      "name": "English",
      "code": "en-US",
      "flag": "america"
    },
    {
      "name": "Français",
      "code": "fr-FR",
      "flag": "france"
    },
    {
      "name": "українська",
      "code": "uk-UA",
      "flag": "ukraine"
    },
    {
      "name": "Wienerisch",
      "code": "at-VIE",
      "flag": "vienna"
    },
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

  specialMode() {
    this.clickCount++;

    setTimeout(() => {
        this.clickCount = 0;
    }, 1500)

    if (this.clickCount == 5) {
      this.clickCount = 0;
      document.getElementsByTagName("body")[0].classList.toggle("invert");
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
        } else if(type == 'taxi') {
          this.dbService.clear("taxi").subscribe();
          localStorage.removeItem("database_taxi_update");
        } else {
          this.dbService.clear("heurigen").subscribe();
          localStorage.removeItem("database_heurigen_update");
          this.dbService.clear("favourites_heurigen").subscribe();
          this.dbService.clear("taxi").subscribe();
          localStorage.removeItem("database_taxi_update");
        }
      }
    });
  }
}