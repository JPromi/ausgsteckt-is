import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor (
    public settingsService: SettingsService
  ){}

  ngOnInit(): void {
    if(this.settingsService.getSettings().systemTheme) {
      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.getElementById('background')?.classList.add("night");
      }
    } else if(this.settingsService.getSettings().darkmode) {
      document.getElementById('background')?.classList.add('night')
    }
  }
}
