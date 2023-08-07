import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { HeaderComponent } from 'src/app/header/header.component';
import * as audienceCategories from "../../../assets/data/audienceCategory.json";
import { CampaignService } from '../campaign.service';




@Component({
  selector: 'app-create-campaign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatStepperModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, HeaderComponent, RouterModule, MatDialogModule],
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
  dialogRef!: MatDialogRef<DialogComponent>;


  detailsForm!: FormGroup;
  locationForm!: FormGroup;
  audienceForm!: FormGroup;
  scheduleForm!: FormGroup;


  constructor(breakpointObserver: BreakpointObserver, private service: CampaignService, private route: Router, private activeRoute: ActivatedRoute, public matDialog: MatDialog) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  index!: string | null;
  ngOnInit() {
    const routerParam = this.activeRoute.snapshot.paramMap;
    this.index = routerParam.get("index");
    if (this.index != null) {
      this.newCampaign = this.service.getExistingCampaign(this.index);
      this.initializeForm();
      this.newCampaign.locations?.forEach((loc: string) => {
        (<FormArray>this.locationForm.get('locations')).push(new FormControl(loc));
      });
    }
    else {
      this.newCampaign = this.service.getNewCampaign();
      this.initializeForm();
    }
  }


  initializeForm() {
    this.detailsForm = new FormGroup({
      name: new FormControl(this.newCampaign.name, Validators.required),
      objective: new FormControl(this.newCampaign.objective, Validators.required),
      category: new FormControl(this.newCampaign.category),
      offerType: new FormControl(this.newCampaign.offerType),
      comments: new FormControl(this.newCampaign.comments)

    });
    this.locationForm = new FormGroup({
      locations: new FormArray([], Validators.required),
      radius: new FormControl(this.newCampaign.radius, Validators.required)
    });
    this.audienceForm = new FormGroup({});
    this.scheduleForm = new FormGroup({
      startDate: new FormControl(this.newCampaign.startDate, Validators.required),
      endDate: new FormControl(this.newCampaign.endDate)
    });
  }


  addLocation() {
    const control = new FormControl(this.value);
    (<FormArray>this.locationForm.get('locations')).push(control);
    this.value = '';
  }

  getLocations() {
    return (<FormArray>this.locationForm.get('locations')).controls;
  }


  removeControl(i: number) {
    (<FormArray>this.locationForm.get('locations')).removeAt(i);
  }

  summarizeNewCampaign() {
    this.newCampaign = {
      ...this.newCampaign,
      name: this.detailsForm.value.name,
      objective: this.detailsForm.value.objective,
      category: this.detailsForm.value.category || 'Category 1',
      offerType: this.detailsForm.value.offerType || 'Offer 1',
      comments: this.detailsForm.value.comments || 'No Comments',
      locations: this.locationForm.value.locations,
      radius: this.locationForm.value.radius,
      startDate: this.scheduleForm.value.startDate,
      endDate: this.scheduleForm.value.endDate,
    };
  }



  saveNewCampaign() {
    if (this.index == null)
      this.service.saveCampaignDetails(this.newCampaign);
    else
      this.service.saveCampaignDetails(this.newCampaign, Number(this.index));
    this.route.navigate(['/manage-campaign/list']);
  }


  openDialog() {
    this.dialogRef = this.matDialog.open(DialogComponent, {
      data: {
        heading: "Submit Campaign Details ",
        body: "Please check all the details provided are correct before Submitting",
        campaignData: null
      }
    });

    this.dialogRef.componentInstance.emitter.subscribe(flag => {
      if (flag)
        this.saveNewCampaign();
      this.dialogRef.close();
    });


  }

}
