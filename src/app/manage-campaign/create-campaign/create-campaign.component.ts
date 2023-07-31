import { Component } from '@angular/core';
import * as audienceCategories from "../../../assets/data/audienceCategory.json";


@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent {
  public isdDropdownVisible: boolean = true;

  public formFlag = 2;
  public offerTypeList = ['Offer 1', 'Offer 2', 'Offer 3'];
  public categoryList = ['Category 1', 'Category 2', 'Category 3'];
  public sectionList = ['Details', 'Location', 'Audience', 'Schedule', 'Summary'];
  public locationArray: any[] = [];
  public radiusList = ['1KM', '500M', '100M'];
  public audienceCategories = JSON.parse(JSON.stringify(audienceCategories)).categoryData;
  public newCampaign = {
    id: 0,
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



  removeLocation(index: number) {
    this.locationArray.splice(index, 1);
  }

  next() { }
  prev() { }


}
