import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Campaign } from './campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  /**
   * create a variable to store the id of recently created campaign 
   */
  recentId: number = 1000;

  constructor(private http: HttpClient) {
    this.getDataFromDatabase();

  }

  /**
   * create an object to store the campaign data
   */
  public campaignData: { [id: number]: Campaign; } = {};

  /**
   * creating a observable to asynchronously update the campaignData on changes
   */
  public campaignData$ = new BehaviorSubject<any>(this.campaignData);


  /**
   * Fetches the data from database
   * store the data in the local variable 
   * call the next() method of the campaignData$ 
   */
  getDataFromDatabase() {
    this.http
      .get<{ [id: number]: Campaign; }>('https://campaign-project-71c7e-default-rtdb.firebaseio.com/campaign.json')
      .pipe(tap(responseData => {
        for (const campaign of Object.values(responseData || {})) {
          this.recentId = Math.max(this.recentId, Number(campaign.id));
        }
      })).subscribe({
        next: (res) => {
          this.campaignData = res;
          this.campaignData$.next(this.campaignData);
        }
      });
  }

  /**
   * returns the campaignData observable
   */
  getAllCampaigns() {
    return this.campaignData$.asObservable();
  };


  /**
   * @param id of the campaign object 
   * @returns campaign object at the given id from campaignData 
   */
  getExistingCampaign = (id: number) => {
    return this.campaignData[id];
  };


  /**
   * @returns an empty campaign object with default values
   */
  getNewCampaign = () => {
    return {
      id: this.recentId + 1,
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
      status: ''
    };
  };


  /**
    * Status is decided on following criteria
    * If starting date is in future then status will be `Scheduled`
    * If Starting date is in the past & End data is in future then status will be `In Progress`
    * If end date is in past then status will be `Completed`
    * If starting date is not set then status will be `Draft`
    * @param startDate is string of starting date
    * @param endDate is string of end date
    */
  getStatus(startDate: string, endDate: string) {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime() || new Date().getTime();
    const end = new Date(endDate).getTime() || new Date().getTime() + 1;
    return start > now ? 'Scheduled' : start <= now && end > now ? 'In Progress' : end < now ? 'Completed' : 'Draft';
  }

  /**
   * Update the data of existing campaign or Put a new Campaign 
   * @param newCampaign object containing the campaign details
   */
  saveCampaignDetails(newCampaign: Campaign) {
    return this.http.put(`https://campaign-project-71c7e-default-rtdb.firebaseio.com/campaign/${newCampaign.id}.json`, newCampaign);
  };


  /**
   * Delete the existing campaign object from the campaignData 
   * @param id of the campaign object in the campaignData  
   */
  removeCampaign(id: number) {
    return this.http.delete(`https://campaign-project-71c7e-default-rtdb.firebaseio.com/campaign/${id}.json`);
  }
}
