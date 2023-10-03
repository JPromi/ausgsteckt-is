import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Settings } from 'src/app/dtos/settings';
import { SettingsService } from 'src/app/services/settings.service';

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
}