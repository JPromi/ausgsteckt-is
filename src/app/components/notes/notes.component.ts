import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Note } from 'src/app/dtos/note';
import { DatabaseService } from 'src/app/services/database.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

  public edit: boolean = false;
  public originalNote: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NotesComponent>,
    public formBuilder: FormBuilder,
    private dbService: NgxIndexedDBService,
    private databaseService: DatabaseService,
    public dialog: MatDialog,

  ) {
    this.originalNote = this.data.note.note;

    dialogRef.backdropClick().subscribe(() => {
      this.closeDialog(true);
    })
  }

  async closeDialog(save: boolean = true) {
    await this.saveNote(save);
    this.data.note.note = this.originalNote;
    this.dialogRef.close({
      saveData: save,
      note: this.data.note
    });
  }

  editNote() {
    this.edit = true;
  }

  async saveNote(saveData = false) {
    if(saveData) {
      this.originalNote = this.data.note.note;
      this.databaseService.getNote(this.data.heuriger.nameId).subscribe(
        (getNote: Note) => {

          if(getNote) {
            this.dbService.update('notes_heurigen', this.data.note).subscribe(
              (response) => {
                console.log(response)
                this.edit = false;
              }
            );
          } else {
            this.dbService.add('notes_heurigen', this.data.note).subscribe(
              (response) => {
                console.log(response);
                this.edit = false;
              }
            );
          }
          
        }
      );
    } else {
      this.data.note.note = this.originalNote;
      this.edit = false;
    }
  }

  deleteNote() {
    var deleteData = false;
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        deleteType: 'notes.delete',
        deleteData: deleteData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.databaseService.getNote(this.data.heuriger.nameId).subscribe(
          (getNote: Note) => {
    
            if(getNote) {
              this.dbService.deleteByKey('notes_heurigen', this.data.heuriger.nameId).subscribe(
                (response) => {
                  this.data.note.note = '';
                  this.originalNote = '';
                }
              );
            } else {
              this.data.note.note = '';
              this.originalNote = '';
            }

            this.closeDialog();
            
          }
        );
      }
    });
  }
}
