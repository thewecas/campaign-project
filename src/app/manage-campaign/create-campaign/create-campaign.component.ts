import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as audienceCategories from "../../../assets/data/audienceCategory.json";
import { CampaignService } from '../campaign.service';


@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent {
  public formFlag = 0;
  public offerTypeList = ['Offer 1', 'Offer 2', 'Offer 3'];
  public categoryList = ['Category 1', 'Category 2', 'Category 3'];
  public sectionList = ['Details', 'Location', 'Audience', 'Schedule', 'Summary'];
  public radiusList = ['1KM', '500M', '100M'];
  public audienceCategories = JSON.parse(JSON.stringify(audienceCategories)).categoryData;
  public title: string = 'Campaign ' + this.sectionList[this.formFlag];
  public isdDropdownVisible: boolean = false;

  public newLocation: string;
  public newCampaignForm!: FormGroup;

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

  constructor(private service: CampaignService, private router: Router) {
  }

  ngOnInit() {
    this.newCampaignForm = new FormGroup({
      details: new FormGroup({
        name: new FormControl('', Validators.required),
        objective: new FormControl('', Validators.required),
        category: new FormControl(''),
        offerType: new FormControl(''),
        comments: new FormControl('', Validators.required)
      }),
      locationList: new FormArray([], Validators.required),
      radius: new FormControl(''),
      Schedule: new FormGroup({
        startDate: new FormControl('', Validators.required),
        endDate: new FormControl('')
      })
    });
  }

  removeLocation(index: number) {
    (<FormArray>this.newCampaignForm.get('locationList')).removeAt(index);
  }

  addLocation() {
    const control = new FormControl(this.newLocation);
    (<FormArray>this.newCampaignForm.get('locationList')).push(control);
    this.newLocation = '';
    console.log(this.newCampaignForm.value);
  }

  setNewCampaignDetails() {
    this.newCampaign = {
      id: this.service.getNewCampaignId(),
      name: this.newCampaignForm.value.details.name,
      objective: this.newCampaignForm.value.details.objective,
      category: this.newCampaignForm.value.details.category || 'Category 1',
      offerType: this.newCampaignForm.value.details.offerType || 'Offer 1',
      comments: this.newCampaignForm.value.details.comments,
      location: this.newCampaignForm.value.locationList,
      radius: this.newCampaignForm.value.radius || '100M',
      audience: [],
      schedule: {
        startDate: this.newCampaignForm.value.Schedule.startDate,
        endDate: this.newCampaignForm.value.Schedule.endDate,
      },
      status: 'Draft',
      ctr: 0,
    };

  };

  saveNewCampaign() {
    this.service.saveNewCampaign(this.newCampaign);
    this.formFlag = 0;
    this.router.navigate(['/campaign/list']);
  }

  next() {
    if (this.formFlag == 4) {
      this.saveNewCampaign();
    }
    else {
      if (this.formFlag == 3) {
        this.setNewCampaignDetails();
      }
      this.formFlag = (this.formFlag + 1) % 5;
      this.newCampaign.name = this.newCampaignForm.value.details.name;
    }
  }

  prev() {
    this.formFlag = ((this.formFlag - 1) % 5);
  }

  getLocations() {
    return (this.newCampaignForm.get('locationList') as FormArray).controls;
  }

}
