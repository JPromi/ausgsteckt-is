import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Heuriger } from 'src/app/dtos/heuriger';
import { DatabaseService } from 'src/app/services/database.service';
import { HeurigerService } from 'src/app/services/heuriger.service';



@Component({
  selector: 'app-all-heurigen',
  templateUrl: './all-heurigen.component.html',
  styleUrls: ['./all-heurigen.component.scss']
})
export class AllHeurigenComponent {

  heurigen:Heuriger[] = [];
  _allHeurigen:Heuriger[] = [];
  heurigenNotes:string[] = [];
  parameter:any;
  requestLoaded:boolean = false;
  error:boolean = false
  viewListType:string = 'all';

  constructor(private heurigenService:HeurigerService, private route: ActivatedRoute, private router: Router, private databaseService: DatabaseService) {

    this.route.queryParams.subscribe(response => {
      this.parameter = response;
    }
    );
  }

  ngOnInit() {
    this.heurigenService.getAllHeurigen(true)
      .subscribe((response: Heuriger[]) => {
        this.heurigen = response;
        this.getFavourite();
        this.getHeurigenNotes();
        this.requestLoaded = true;
        this.databaseService.updateHeurigen(response);
      },
      (error) => {
        this.error = true;
        this.databaseService.getHeurigen().subscribe(
          (responseDB: Heuriger[]) => {
            this.heurigen = responseDB;
            this.getFavourite();
            this.getHeurigenNotes();
            this.requestLoaded = true;
          },
          (error) => {
            this.requestLoaded = true;
          }
        );
      }
    );
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  getFavourite() {
    this.databaseService.getHeurigenFavourites().subscribe(
      (favourites) => {
        for (let i = 0; i < favourites.length; i++) {
          this.heurigen = this.heurigen.map(item => {
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
    this.heurigen.sort((a, b) => {
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

  getHeurigenNotes() {
    this.databaseService.getNotes().subscribe(
      (notes) => {
        for (let i = 0; i < notes.length; i++) {
          this.heurigenNotes.push(notes[i].nameId);
        }
      }
    );
  }

  checkIfHasNotes(heuriger: Heuriger): boolean {
    for (let i = 0; i < this.heurigenNotes.length; i++) {
      if (heuriger.nameId == this.heurigenNotes[i]) {
        return true;
      }
    }
    return false;
  }

  toggleView(type:string = 'all') {
    if(type == 'all') {
      this.viewListType = 'all';
      // this.ngOnInit();
      this.heurigen = this._allHeurigen;
    } else if(type == 'notes') {
      this.viewListType = 'notes';
      this.loadListNotes();
    }
  }

  loadListNotes() {
    this._allHeurigen = []
    for (let i = 0; i < this.heurigen.length; i++) {
      this._allHeurigen.push(this.heurigen[i]);
      if (!this.checkIfHasNotes(this.heurigen[i])) {
        this.heurigen.splice(i, 1);
        i--;
      }
    }
  }

  checkIfHeurigerIsVisible(heuriger:Heuriger): boolean {
    if(this.viewListType == 'all') {
      if(heuriger.type == 'heuriger' || heuriger.type == 'weinrat') {
        return true;
      }
    } else if(this.viewListType == 'notes') {
      return true;
    }
    return false;
  }
}
