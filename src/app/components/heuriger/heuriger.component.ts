import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { HeurigerService } from "../../services/heuriger.service";
import { Heuriger, ausgsteckt, coordinates, phone } from 'src/app/dtos/heuriger';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateService } from '@ngx-translate/core';
import { Share } from '@capacitor/share';
import { EmptyObjectService } from 'src/app/services/empty-object.service';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotesComponent } from '../notes/notes.component';
import { Note } from 'src/app/dtos/note';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-heuriger',
  templateUrl: './heuriger.component.html',
  styleUrls: ['./heuriger.component.scss']
})
export class HeurigerComponent {

  heuriger:Heuriger = this.emptyObjectService.heuriger();
  heurigenNote:Note = new Note();
  mapsLink:string = "";
  heurigerLoading = false;
  today: Date = new Date();
  shareSupported: boolean = false;
  indexeddbSupported: boolean = false;

  constructor(
    private heurigenService:HeurigerService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private databaseService: DatabaseService,
    private translate: TranslateService,
    private emptyObjectService: EmptyObjectService,
    public dialog: MatDialog,
    private dbService: NgxIndexedDBService
  ) {
    
  }

  ngOnInit() {
    this.checkSupports();
    this.loadContent();
  }

  async loadContent(): Promise<Object> {
    this.heurigerLoading = true;
    return this.route.params.subscribe(async heuriger => {
      ((this.heurigenService.getHeuriger(heuriger["heuriger"])))
      .subscribe((response: Heuriger) => {
        if(!response["id"]) {
          this.router.navigateByUrl("/heurigen");
          return null;
        }
        this.heuriger = response;
        this.heurigerLoading = false;
        this.checkDataType();
        this.getFavourite();
        this.getNote();
        this.generateMapsLink();
        return heuriger["heuriger"];
      },
      (err) => {
        this.databaseService.getHeuriger(heuriger["heuriger"]).subscribe(
          (responseDB: Heuriger) => {
            responseDB.daysRemain = this.daysRemain(responseDB);
            this.heuriger = responseDB;
            this.heurigerLoading = false;
            this.getFavourite();
            this.getNote();
            this.generateMapsLink();
          }
        )
      }
      )
      ;
    });
  }

  generateMapsLink() {
    var url = "http://maps.google.com/maps?t=h&q=";
    this.mapsLink = url + this.heuriger.address.replace(" ", "+") + ',' +  '+' + this.heuriger.city.replace(" ", "+");
  }

  convertDate(date: string) {
    var dateConvert = new Date(date);

    return dateConvert.getDate() + "." + (dateConvert.getMonth() + 1)  + "." + dateConvert.getFullYear();
  }

  backClick() {
    this._location.back();
  }

  daysRemain(heuriger: Heuriger): number {
    const today = new Date();
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

  getFavourite() {
    this.databaseService.getSingleHeurigenFavourites(this.heuriger.nameId).subscribe(
      (favourite) => {
        if(favourite && favourite.favourite) {
          this.heuriger.favourite = true;
        }
      }
    );
  }

  getNote() {
    this.databaseService.getNote(this.heuriger.nameId).subscribe(
      (note: Note) => {
        if(note) {
          this.heurigenNote = note;
        } else {
          this.heurigenNote = new Note(this.heuriger.nameId, '')
        }
      }
    )
  }

  toggleFavourite() {
    if(this.heuriger.favourite) {
      this.heuriger.favourite = false;
    } else {
      this.heuriger.favourite = true;
    }

    this.databaseService.heurigenFavouritesToggle(this.heuriger.nameId)
  }

  checkIfFuture(date: string): boolean {
    var checkdate = new Date(date);
    
    if(checkdate >= this.today) {
      return true;
    } else {
      return false;
    }
  }

  async checkSupports() {
    // share
    this.shareSupported = (await Share.canShare()).value;
  }

  async share() {
    var shareData = {
      title: this.heuriger.name,
      text: `${this.heuriger.name}\n`
    }

    if(this.heuriger.address) {
      shareData.text += `\n📍 ${this.heuriger.address}, ${this.heuriger.city}`
    }
    if(this.heuriger.phone.main) {
      shareData.text += `\n📞 ${this.heuriger.phone.main}`
    }
    if(this.heuriger.email) {
      shareData.text += `\n📧 ${this.heuriger.email}`
    }
    if(this.heuriger.link) {
      shareData.text += `\n🌍 ${this.heuriger.link}`
    }

    shareData.text += `\n\n${this.translate.instant('heuriger.dates.title')}`;

    var today = new Date();

    for (let i = 0; i < this.heuriger.ausgsteckt.length; i++) {
      var heurigenEnd = new Date(this.heuriger.ausgsteckt[i].to);
      if(heurigenEnd >= today) {
        shareData.text += `\n📅 ${this.convertDate(this.heuriger.ausgsteckt[i].from)} - ${this.convertDate(this.heuriger.ausgsteckt[i].to)}`;
      }

      
    }
    
    // navigator.share(shareData);
    try {
      await Share.share(shareData);
    } catch (error) {
      console.error('Fehler beim Teilen: ', error);
    }
  }

  checkDataType() {
    this.route.url.subscribe(
      (url) => {
        if(
          (url[0].path == 'event' && this.heuriger.type == 'event') ||
          (url[0].path == 'heurigen' && this.heuriger.type == 'heuriger') ||
          (url[0].path == 'heurigen' && this.heuriger.type == 'weinrat')
          ) {
        } else {
          this.router.navigateByUrl("/heurigen");
        }
      }
    );
  }

  note() {
    let dialogRef = this.dialog.open(NotesComponent, {
      height: '500px',
      width: '500px',
      data: {
        heuriger: this.heuriger,
        note: this.heurigenNote
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if(dialogResult) {

        if(dialogResult.saveData === true) {

          this.heurigenNote = dialogResult.note

          this.databaseService.getNote(this.heuriger.nameId).subscribe(
            (getNote: Note) => {

              if(getNote) {
                this.dbService.update('notes_heurigen', dialogResult.note).subscribe(
                  (response) => {
                    console.log(response)
                  }
                );
              } else {
                this.dbService.add('notes_heurigen', dialogResult.note).subscribe(
                  (response) => {
                    console.log(response)
                  }
                );
              }
              
            }
          );

        }

      }

    })
  }

}
