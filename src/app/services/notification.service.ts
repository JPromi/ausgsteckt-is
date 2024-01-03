import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Heuriger } from '../dtos/heuriger';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private router: Router
  ) { }

  async notificationHeurigen(heuriger: Heuriger) {
    var notificationDateString = this.nextTimeOpen(heuriger);

    if(notificationDateString) {
      var notificationDate = new Date(notificationDateString);
      notificationDate.setHours(8);

      await LocalNotifications.schedule({
        notifications: [
          {
            title: heuriger.name,
            body: `${heuriger.name} hat ab Heute geöffnet!`,
            id: Math.floor(Math.random() * 1000000) + 1,
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
