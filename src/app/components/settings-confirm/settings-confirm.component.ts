import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-confirm',
  templateUrl: './settings-confirm.component.html',
  styleUrls: ['./settings-confirm.component.scss']
})
export class SettingsConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SettingsConfirmComponent>
  ) {
  }

  closeDialog(deleteData: boolean = false) {
    this.dialogRef.close(deleteData);
  }
}
