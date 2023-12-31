import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DialogComponent } from "src/app/shared/dialog/dialog.component";
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { SnakBarComponent } from 'src/app/shared/snak-bar/snak-bar.component';
import { CampaignService } from '../campaign.service';
import { ViewTemplateComponent } from '../view-template/view-template.component';

@Component({
  selector: 'app-view-campaign',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterModule, HeaderComponent, ViewTemplateComponent, MatDialogModule],
  templateUrl: './view-campaign.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class ViewCampaignComponent {

  public id!: number; /* index of the campaign object being viewed  */
  public campaign: any; /* object to store the campaign data */
  title: string = 'Manage Campaign'; /* title to be displayed on the header */
  dialogRef!: MatDialogRef<DialogComponent>;  /* Reference to dialog component */

  constructor(private route: ActivatedRoute, private service: CampaignService, public matDialog: MatDialog, public router: Router, private _snackBar: MatSnackBar) {
  }

  /**
   * get the id of the campaign object from the route
   * get the campaign object from the service using index
   */
  ngOnInit(): void {
    const routerParam = this.route.snapshot.paramMap;
    this.id = Number(routerParam.get('id'));

    if (!!this.id)
      this.campaign = this.service.getExistingCampaign(this.id);
  };




  /**
   * open confirmation dialog to delete the campaign data
   * When the emitted values from the component is true, the campaign data will be removed
   */
  openDialog() {
    this.dialogRef = this.matDialog.open(DialogComponent, {
      data: {
        heading: "Delete Campaign ?",
        body: "Campaign with following details will be Deleted permanently",
        campaignData: this.campaign
      }
    });
    this.dialogRef.componentInstance.emitter.subscribe(flag => {
      if (flag) {
        this.service.removeCampaign(this.id).subscribe({
          next: (res) => {
            this.openSnackBar();
            this.service.getDataFromDatabase();
            this.dialogRef.close();
            this.router.navigate(['/manage-campaign/list']);
          },
          error: (err) => console.error(err.message),
        });

      }
      else {
        this.dialogRef.close();
      }
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

