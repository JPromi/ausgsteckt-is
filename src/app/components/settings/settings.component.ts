import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Settings } from 'src/app/dtos/settings';
import { SettingsService } from 'src/app/services/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    public settingsService: SettingsService,
    public formBuilder: FormBuilder
  ) {}

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
}