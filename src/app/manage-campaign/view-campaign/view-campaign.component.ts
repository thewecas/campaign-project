import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/header/header.component';
import { DialogComponent } from "../../dialog/dialog.component";
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-view-campaign',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, HeaderComponent, MatDialogModule],
  templateUrl: './view-campaign.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class ViewCampaignComponent {

  public index: string = "";
  public campaign: any;
  title = 'Manage Campaign';
  dialogRef!: MatDialogRef<DialogComponent>;

  constructor(private route: ActivatedRoute, private service: CampaignService, public matDialog: MatDialog, public router: Router) {
  }

  ngOnInit(): void {
    const routerParam = this.route.snapshot.paramMap;
    this.index = String(routerParam.get('index'));
    this.campaign = this.service.getExistingCampaign(this.index);
  }

  openDialog() {
    this.dialogRef = this.matDialog.open(DialogComponent, {
      data: {
        heading: "Are you sure ?",
        body: "Campaign with following details will be Deleted permanently",
        campaignData: this.campaign
      }
    });

    this.dialogRef.componentInstance.emitter.subscribe(flag => {
      if (flag)
        this.service.removeCampaign(Number(this.index));
      this.dialogRef.close();
      this.router.navigate(['/manage-campaign/list']);

    });


  }
}

