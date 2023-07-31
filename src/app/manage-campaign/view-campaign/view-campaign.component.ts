import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['../campaign.scss']
})
export class ViewCampaignComponent {
  public productIndex: string = "";
  public campaign: any;

  constructor(private route: ActivatedRoute, private campaignService: CampaignService) {
  }

  ngOnInit(): void {
    const routerParam = this.route.snapshot.paramMap;
    this.productIndex = String(routerParam.get('id'));

    this.campaign = this.campaignService.getCampaign(this.productIndex);
  }

}
