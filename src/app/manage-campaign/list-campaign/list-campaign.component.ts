import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../campaign.service';
@Component({
  selector: 'app-list-campaign',
  templateUrl: './list-campaign.component.html',
  styleUrls: ['../campaign.scss']
})
export class ListCampaignComponent implements OnInit {
  public campaignData !: any[];
  public isAscending: boolean = true;
  public sortBy: string = "";

  constructor(private service: CampaignService) { };

  ngOnInit() {
    this.service.getAllCampaigns().subscribe(res => this.campaignData = res || []);
    console.log(this.campaignData);

  };

  sortTable() {
    this.campaignData.sort((item1: any, item2: any) => {
      let value;
      if (this.sortBy == "startDate")
        value = new Date(item2.schedule[this.sortBy]).getTime() - new Date(item1.schedule[this.sortBy]).getTime();
      else
        value = item2[this.sortBy] >= item1[this.sortBy] ? 1 : -1;

      return this.isAscending ? value : value * -1;
    });
    this.isAscending = !this.isAscending;
  }
};



