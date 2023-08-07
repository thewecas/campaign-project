import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as campaignList from '../../assets/data/campaign.json';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  /**
   * fetch, parse and store the data from campaign.json file
   */
  public campaignData: any[] = JSON.parse(JSON.stringify(campaignList)).data;


  /**
   * creating a observable to asynchronously update the campaignData on changes
   */
  public campaignDataObservable = new BehaviorSubject<any>(this.campaignData);


  /**
   * returns the campaignData observable
   * asynchronously emits the updated data with next()
   */
  getAllCampaigns() {
    return this.campaignDataObservable.asObservable();
  };


  /**
   * @param index of the campaign object in the array
   * @returns campaign object at the given index from campaignData array
   */
  getExistingCampaign = (index: number) => {
    return this.campaignData[index];
  };


  /**
   * @returns an empty campaign object with default values
   */
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


  /**
   * @returns new id for the campaign
   */
  getNewCampaignId() {
    return Math.max(...this.campaignData.map(campaign => campaign.id), 10000) + 1;
  };


  /**
   * Update the data of existing campaign
   * @param newCampaign object containing the campaign details
   * @param index of the object in the campaignData array
   */
  saveCampaignDetails(newCampaign: any, index?: number) {
    if (index == null || index == undefined)
      this.campaignData.push(newCampaign);
    else
      this.campaignData[index] = newCampaign;
    this.campaignDataObservable.next(this.campaignData);
  };


  /**
   * Delete the existing campaign object from the campaignData array
   * @param index of the campaign object in the array 
   */
  removeCampaign(index: number) {
    this.campaignData.splice(index, 1);
    this.campaignDataObservable.next(this.campaignData);
  }
}
