import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { HeaderComponent } from 'src/app/header/header.component';
import { SnakBarComponent } from 'src/app/snak-bar/snak-bar.component';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-list-campaign',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatDialogModule, MatSortModule, MatMenuModule, HeaderComponent],
  templateUrl: './list-campaign.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class ListCampaignComponent implements AfterViewInit, OnInit {

  public campaignData !: any[];  /* array to store all campaign data */
  title = 'Manage Campaign';  /* title to display on the header */
  dialogRef!: MatDialogRef<DialogComponent>; /*  reference to dialog component */
  public dataSource!: MatTableDataSource<any>;
  campaignSubscription!: Subscription;


  columnsToDisplay = ['id', 'name', 'status', 'ctr', 'startDate', 'actions'];  /* array of table heading  */

  constructor(private service: CampaignService, private matDialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.campaignSubscription = this.service.getAllCampaigns().subscribe(res => {
      this.campaignData = res;
      this.dataSource = new MatTableDataSource(this.campaignData);
    });
  }

  /* sort the table  */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  };

  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Open the dialog to show delete confirmation dialog
   * pass the necessary data to display
   * @param index of the campaign object whose action button in pressed
   */
  openDialog(index: number) {
    this.dialogRef = this.matDialog.open(DialogComponent, {
      data: {
        heading: "Delete Campaign ?",
        body: "Campaign with following details will be Deleted permanently",
        campaignData: this.campaignData[index]
      }
    });

    /**
     * subscribe to the Event emitter instance of the dialog
     * if flag is true then remove the campaign object
     */
    this.dialogRef.componentInstance.emitter.subscribe(flag => {
      if (flag) {
        this.service.removeCampaign(Number(index));
        this.openSnackBar();
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


}
