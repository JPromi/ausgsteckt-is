import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-export',
  templateUrl: './settings-export.component.html',
  styleUrls: ['./settings-export.component.scss']
})
export class SettingsExportComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SettingsExportComponent>
  ) {
  }

  closeDialog(exportDate: boolean = false) {
    this.dialogRef.close(exportDate);
  }
}
