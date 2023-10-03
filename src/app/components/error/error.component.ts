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
    if(this.settingsService.checkDarkmode()) {
      document.getElementById('background')?.classList.add("night");
    } else {
      document.getElementById('background')?.classList.remove("night");
    }
  }
}
