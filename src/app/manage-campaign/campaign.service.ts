import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as campaignList from '../../assets/data/campaign.json';

@Injectable({
  providedIn: 'root'
})

export class CampaignService {
  public campaignData: any[] = JSON.parse(JSON.stringify(campaignList)).data;

  public newCampaign = {};

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

  initiateNewCampaign() {
    this.newCampaign = {
      id: this.getNewCampaignId(),
      name: '',
      objective: '',
      category: 'Category 1',
      offerType: 'Offer 1',
      comments: '',
      location: [],
      radius: '100M',
      audience: [],
      schedule: {
        startDate: '',
        endDate: '',
      },
      status: 'Draft',
      ctr: 0,

    };
  };

  saveNewCampaign() {
    this.campaignData.push(this.newCampaign);
    this.campaignDataObservable.next(this.campaignData);
  };

}
