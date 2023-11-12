import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { HeurigerService } from 'src/app/services/heuriger.service';
import { Heuriger } from 'src/app/dtos/heuriger';
import { DatabaseService } from 'src/app/services/database.service';
import { HeurigerFavourite } from 'src/app/dtos/heuriger-favourite';
import { DateAdapter } from '@angular/material/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-current-heurigen',
  templateUrl: './current-heurigen.component.html',
  styleUrls: ['./current-heurigen.component.scss'],
})
export class CurrentHeurigenComponent {

  currentHeurigen:Heuriger[] = [];
  parameter:any;
  dateDisplay:any;
  requestLoaded:boolean = false;
  selectedDate = new FormControl('');
  favouriteHeurige: HeurigerFavourite[] = [];
  
  constructor(
    private heurigenService:HeurigerService,
    private route: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService,
    private languageService: LanguageService,
    private dateAdapter: DateAdapter<Date>
    ) {

    this.route.queryParams.subscribe(response => {
      this.parameter = response;
    }
    );
    this.datePickerLanguage();
  }
  
  ngOnInit(dateP = '') {
    var parameter = '';
    if(dateP == '') {
      if(!this.parameter.date) {
        const currentDate = new Date();
        parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' + this.checkDateZero(currentDate.getDate());
      } else {
        const currentDateT = Date.parse(this.parameter.date);
        const currentDate = new Date(currentDateT);
        parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' +this.checkDateZero(currentDate.getDate());
      }
    } else {
      parameter = dateP;
    }    

    this.loadContent(parameter);
      
    if(!this.parameter.date) {
      const currentDate = new Date();
      this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
    } else {
      const currentDateT = Date.parse(this.parameter.date);
      const currentDate = new Date(currentDateT);
      this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
    }
  }

  async lastDate() {
    if(!this.parameter.date) {
      var parameter = '';
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      parameter = await currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' + this.checkDateZero(currentDate.getDate());
    } else {
      const currentDateT = Date.parse(this.parameter.date);
      const currentDate = new Date(currentDateT);
      currentDate.setDate(currentDate.getDate() - 1);
      parameter = await currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' +this.checkDateZero(currentDate.getDate());
    }
    
    this.router.navigate(['/ausgsteckt'], { queryParams: { date: parameter}});
    
    
    this.loadContent(parameter);
  }

  nextDate() {    
    if(!this.parameter.date) {
      var parameter = '';
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' + this.checkDateZero(currentDate.getDate());
    } else {
      const currentDateT = Date.parse(this.parameter.date);
      const currentDate = new Date(currentDateT);
      currentDate.setDate(currentDate.getDate() + 1);
      parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' +this.checkDateZero(currentDate.getDate());
    }

    this.router.navigate(['/ausgsteckt'], { queryParams: { date: parameter}});
    
    
    this.ngOnInit(parameter);
  }

  specificDate(event: any) {
    const currentDateT = event.target.value;
    const currentDate = new Date(currentDateT);
    var parameter = currentDate.getFullYear() + '-' + this.checkDateZero(currentDate.getMonth() + 1) + '-' +this.checkDateZero(currentDate.getDate());

    this.router.navigate(['/ausgsteckt'], { queryParams: { date: parameter}});
    
    
    this.ngOnInit(parameter);
  }

  checkDateZero(number:number):String {
    let dateNumber = number.toString();
    if(number < 10) {
      dateNumber = '0' + number.toString();
    }

    return dateNumber;
  }

  async loadContent(parameter:any) {
    await this.heurigenService.getHeurigenByDate(parameter)
      .subscribe(async (response: Heuriger[]) => {

        var currentDate: Date;

        if(!this.parameter.date) {
          var _currentDate = new Date();
          currentDate = new Date(_currentDate.getFullYear(), _currentDate.getMonth(), _currentDate.getDate(), 1, 0, 0, 0);
          this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
        } else {
          const currentDateT = Date.parse(this.parameter.date);
          currentDate = new Date(currentDateT);
          this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
        }

        var _currentHeurigen: Heuriger[] = [];
        if(response) {
          await response.forEach(async heuriger => {
            await heuriger.ausgsteckt.forEach(
              heurigerDate => {
                if(new Date(heurigerDate.from) <= currentDate && new Date(heurigerDate.to) >= currentDate) {
                  heuriger.daysRemain = this.daysRemain(heuriger, currentDate);
                  _currentHeurigen.push(heuriger);
                }
              }
            )
          });
        } else {
          this.requestLoaded = true;
        }

        this.currentHeurigen = _currentHeurigen;
        this.getFavourite();
        this.requestLoaded = true;
      },
      (error: any) => {
        if(!this.parameter.date) {
          var _searchDate = new Date();
          var searchDate = new Date(_searchDate.getFullYear(), _searchDate.getMonth(), _searchDate.getDate(), 1, 0, 0, 0);
        } else {
          const searchDateT = Date.parse(this.parameter.date);
          var searchDate = new Date(searchDateT);
        }

        var _currentHeurigen: Heuriger[] = [];

        this.databaseService.getHeurigen().subscribe(
          async (allHeurigen: Heuriger[]) => {
            await allHeurigen.forEach(async heuriger => {
              await heuriger.ausgsteckt.forEach(
                heurigerDate => {
                  if(new Date(heurigerDate.from) <= searchDate && new Date(heurigerDate.to) >= searchDate) {
                    heuriger.daysRemain = this.daysRemain(heuriger, searchDate);
                    _currentHeurigen.push(heuriger);
                  }
                }
              )
            });

            this.currentHeurigen = _currentHeurigen
            this.requestLoaded = true;
          }
        )
      }
    );

    this.selectedDate.setValue(parameter);
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  daysRemain(heuriger: Heuriger, date: Date = new Date()): number {
    const today = date;
    var returnValue = 0;

    for (const date of heuriger.ausgsteckt) {
      const startDate = new Date(date.from);
      const endDate = new Date(date.to);

      if (today >= startDate && today <= endDate) {
        const diffTime = Math.abs(endDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
        break;
      }
    }

    return returnValue;
  }

  checkCurrentDate(start: string, end: string) {
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
  };

  getFavourite() {
    this.databaseService.getHeurigenFavourites().subscribe(
      (favourites) => {
        for (let i = 0; i < favourites.length; i++) {
          this.currentHeurigen = this.currentHeurigen.map(item => {
            if (item.nameId === favourites[i].nameId) {
              item.favourite = true;
            }
            return item;
          });
        }
        this.orderByFavourites();
      }
    )
  }

  orderByFavourites() {
    this.currentHeurigen.sort((a, b) => {
      if (a.favourite === b.favourite) {
        return a.name.localeCompare(b.name); // order by name
      } else {
        return a.favourite ? -1 : 1;
      }
    });
  }

  generateSingleViewLink(heuriger: Heuriger): string {
    if(heuriger.type == 'event') {
      return '/event/' + heuriger.nameId
    } else {
      return '/heurigen/' + heuriger.nameId
    }
  }

  datePickerLanguage() {
    this.dateAdapter.setLocale(this.languageService.getCurrentLanguage().realCode);
  }

}
