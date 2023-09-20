import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { HeurigerService } from 'src/app/services/heuriger.service';
import { Heuriger } from 'src/app/dtos/heuriger';

@Component({
  selector: 'app-current-heurigen',
  templateUrl: './current-heurigen.component.html',
  styleUrls: ['./current-heurigen.component.scss'],
})
export class CurrentHeurigenComponent {

  currentHeurigen:any;
  parameter:any;
  dateDisplay:any;
  requestLoaded:boolean = false;
  selectedDate = new FormControl('');
  
  constructor(private heurigenService:HeurigerService, private route: ActivatedRoute, private router: Router) {

    this.route.queryParams.subscribe(response => {
      this.parameter = response;
    }
    );
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
      .subscribe((response: Heuriger[]) => {
        this.currentHeurigen = response;
        this.requestLoaded = true;

        if(!this.parameter.date) {
          const currentDate = new Date();
          this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
        } else {
          const currentDateT = Date.parse(this.parameter.date);
          const currentDate = new Date(currentDateT);
          this.dateDisplay = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
        }
      },
      (error: any) => {
        this.currentHeurigen = null;
        this.requestLoaded = true;
      }
    );

    this.selectedDate.setValue(parameter);
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
