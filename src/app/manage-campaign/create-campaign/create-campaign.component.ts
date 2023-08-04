import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderComponent } from 'src/app/header/header.component';
import * as audienceCategories from "../../../assets/data/audienceCategory.json";
import { CampaignService } from '../campaign.service';




@Component({
  selector: 'app-create-campaign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatStepperModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, HeaderComponent],
  templateUrl: './create-campaign.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class CreateCampaignComponent {
  stepperOrientation: Observable<StepperOrientation>;
  value = '';
  newCampaign: any;
  isDropDownVisible = false;
  public audienceCategories = JSON.parse(JSON.stringify(audienceCategories)).categoryData;
  title = 'Campaign';

  detailsForm!: FormGroup;
  locationForm!: FormGroup;
  audienceForm!: FormGroup;
  scheduleForm!: FormGroup;


  constructor(breakpointObserver: BreakpointObserver, private service: CampaignService, private route: Router) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.detailsForm = new FormGroup({
      name: new FormControl('', Validators.required),
      objective: new FormControl('', Validators.required),
      category: new FormControl(''),
      offerType: new FormControl(''),
      comments: new FormControl('')

    });
    this.locationForm = new FormGroup({
      locations: new FormArray([], Validators.required),
      radius: new FormControl('', Validators.required)
    });
    this.audienceForm = new FormGroup({});
    this.scheduleForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('')
    });

  }


  addLocation() {
    const control = new FormControl(this.value);
    (<FormArray>this.locationForm.get('locations')).push(control);
  }

  getLocations() {
    return (<FormArray>this.locationForm.get('locations')).controls;
  }


  removeControl(i: number) {
    (<FormArray>this.locationForm.get('locations')).removeAt(i);
  }

  summarizeNewCampaign() {
    this.newCampaign = {
      id: this.service.getNewCampaignId(),
      name: this.detailsForm.value.name,
      objective: this.detailsForm.value.objective,
      category: this.detailsForm.value.category || 'Category 1',
      offerType: this.detailsForm.value.offerType || 'Offer 1',
      comments: this.detailsForm.value.comments || 'No Comments',
      locations: this.locationForm.value.locations,
      radius: this.locationForm.value.radius,
      startDate: this.scheduleForm.value.startDate,
      endDate: this.scheduleForm.value.endDate,
      crt: 0,
      status: 'Draft'
    };
  }



  saveNewCampaign() {
    this.service.saveNewCampaign(this.newCampaign);
    this.route.navigate(['/manage-campaign/list']);
  }


}
