import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Heuriger } from '../dtos/heuriger';
import { Router } from '@angular/router';
import { SettingsService } from './settings.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private databaseService: DatabaseService
  ) { }

  async notificationHeurigen(heuriger: Heuriger) {
    var notificationDateString = this.nextTimeOpen(heuriger);

    if(notificationDateString) {
      var notificationDate = new Date(notificationDateString);
      notificationDate.setHours(10);

      console.log(heuriger.id);

      await LocalNotifications.schedule({
        notifications: [
          {
            title: heuriger.name,
            body: `${heuriger.name} hat ab Heute geöffnet!`,
            // id: Math.floor(Math.random() * 1000000) + 1,
            id: heuriger.id,
            schedule: { at: notificationDate },
            // schedule: { at: new Date(Date.now() + 1000 * 5)},
            extra: {
              route: `/heurigen/${heuriger.nameId}`
            }
            
          },
        ],
      });
    }
    
  }

  generateAllNotifications() {
    if(this.settingsService.getSettings().notificationAll) {
      LocalNotifications.deleteChannel({ id: 'all' });

      this.databaseService.getHeurigenFavourites().subscribe(
        (heurigen) => {
          heurigen.forEach(
            (heuriger) => {
              this.databaseService.getHeuriger(heuriger.nameId).subscribe(
                (heuriger) => {
                  this.notificationHeurigen(heuriger);
                }
              );
            }
          );
        }
      );
    }
  }

  private nextTimeOpen(heuriger: Heuriger) {
    var now = new Date();
    var nextTimeOpen = '';
    heuriger.ausgsteckt.forEach(
      (ausgsteckt) => {
        var _ausgstecktDate = new Date(ausgsteckt.from);
        if(now < _ausgstecktDate) {
          nextTimeOpen = ausgsteckt.from;
        }
      }
    );

    return nextTimeOpen;
  }
}
