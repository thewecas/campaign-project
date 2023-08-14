import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { SnakBarComponent } from 'src/app/shared/snak-bar/snak-bar.component';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-list-campaign',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatDialogModule, MatSortModule, MatMenuModule, HeaderComponent],
  templateUrl: './list-campaign.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class ListCampaignComponent implements OnInit {

  campaignData: Campaign[] = [];  /* array to store all campaign data */
  title: string = 'Manage Campaign';  /* title to display on the header */
  dialogRef!: MatDialogRef<DialogComponent>; /*  reference to dialog component */
  dataSource!: MatTableDataSource<Campaign>;
  campaignSubscription!: Subscription;
  isFetching = false;

  columnsToDisplay = ['id', 'name', 'status', 'ctr', 'startDate', 'actions'];  /* array of table heading  */

  constructor(private service: CampaignService, private matDialog: MatDialog, private _snackBar: MatSnackBar) {
  }


  ngOnInit(): void {
    this.isFetching = true;
    this.campaignSubscription = this.service.getAllCampaigns().subscribe(res => {
      this.isFetching = false;
      this.campaignData = Object.values(res);
      this.dataSource = new MatTableDataSource(this.campaignData);
      this.dataSource.sort = this.sort;

    });
  }

  /* sort the table  */
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  /**
   * Open the dialog to show delete confirmation dialog
   * pass the necessary data to display
   * @param index of the campaign object whose action button in pressed
   */
  openDialog(id: number) {
    this.dialogRef = this.matDialog.open(DialogComponent, {
      data: {
        heading: "Delete Campaign ?",
        body: "Campaign with following details will be Deleted permanently",
        campaignData: this.service.getExistingCampaign(id)
      }
    });

    /**
     * subscribe to the Event emitter instance of the dialog
     * if flag is true then remove the campaign object
     */
    this.dialogRef.componentInstance.emitter.subscribe(flag => {
      if (flag) {
        this.service.removeCampaign(id).subscribe({
          next: (res) => {
            this.openSnackBar();
            this.service.getDataFromDatabase();
          },
          error: (err) => console.error(err.message),
        });
      }
      this.dialogRef.close();

    });

  }

  /**
   * display the snakbar
   */
  openSnackBar() {
    this._snackBar.openFromComponent(SnakBarComponent, {
      duration: 3000,
      data: "Deleted successfully"
    });
  }


  ngOnDestroy() {
    this.campaignSubscription.unsubscribe();
  }

}
