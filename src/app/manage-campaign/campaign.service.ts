import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as campaignList from '../../assets/data/campaign.json';

@Injectable({
  providedIn: 'root'
})

export class CampaignService {
  public campaignData: any[] = JSON.parse(JSON.stringify(campaignList)).data;
  constructor() {
  }

  public campaignDataObservable = new BehaviorSubject<any>(this.campaignData);

  getAllCampaigns() {
    return this.campaignDataObservable.asObservable();
  };

  getCampaign = (productIndex: String) => {
    return this.campaignData[Number(productIndex)];
  };

  getNewCampaignId() {
    return Math.max(...this.campaignData.map(campaign => campaign.id), 10000) + 1;
  };

  saveNewCampaign(newCampaign: any) {
    this.campaignData.push(newCampaign);
    this.campaignDataObservable.next(this.campaignData);
  };

}
