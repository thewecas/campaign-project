import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/header/header.component';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-view-campaign',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, HeaderComponent],
  templateUrl: './view-campaign.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class ViewCampaignComponent {

  public productIndex: string = "";
  public campaign: any;
  title = 'Manage Campaign';

  constructor(private route: ActivatedRoute, private campaignService: CampaignService) {
  }

  ngOnInit(): void {
    const routerParam = this.route.snapshot.paramMap;
    this.productIndex = String(routerParam.get('index'));
    this.campaign = this.campaignService.getCampaign(this.productIndex);
  }
}

