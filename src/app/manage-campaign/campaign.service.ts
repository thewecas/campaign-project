import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as campaignList from '../../assets/data/campaign.json';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  public campaignData: any[] = JSON.parse(JSON.stringify(campaignList)).data;
  public campaignDataObservable = new BehaviorSubject<any>(this.campaignData);

  getAllCampaigns() {
    return this.campaignDataObservable.asObservable();
  };

  getExistingCampaign = (productIndex: String) => {
    return this.campaignData[Number(productIndex)];
  };

  getNewCampaign = () => {
    return {
      id: this.getNewCampaignId(),
      name: '',
      objective: '',
      category: '',
      offerType: '',
      comments: '',
      locations: [],
      radius: '',
      startDate: '',
      endDate: '',
      crt: 0,
      status: 'Draft'
    };
  };

  getNewCampaignId() {
    return Math.max(...this.campaignData.map(campaign => campaign.id), 10000) + 1;
  };

  saveCampaignDetails(newCampaign: any, index?: number) {
    if (index == null || index == undefined)
      this.campaignData.push(newCampaign);
    else
      this.campaignData[index] = newCampaign;
    this.campaignDataObservable.next(this.campaignData);
  };
}
