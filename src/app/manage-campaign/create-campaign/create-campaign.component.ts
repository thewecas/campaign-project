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
import { ViewTemplateComponent } from '../view-template/view-template.component';




@Component({
  selector: 'app-create-campaign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatStepperModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, HeaderComponent, RouterModule, MatDialogModule, ViewTemplateComponent],
  templateUrl: './create-campaign.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class CreateCampaignComponent {
  stepperOrientation: Observable<StepperOrientation>;  /*  observable to change orientation of the stepper */
  title = 'Campaign';  /* title th display on the header */
  locationValue = '';  /* variable to store the location input  */
  newCampaign: any; /*  object to store the campaign details */
  isDropDownVisible = false; /*  flag to toggle the display of dropdown in audience step */
  public audienceCategories = JSON.parse(JSON.stringify(audienceCategories)).categoryData;  /*  data to display in the audience dropdown */
  dialogRef!: MatDialogRef<DialogComponent>; /*  reference of dialog */
  index!: number | null; /* variable to store the index of existing object  */


  /* forms to store the campaign data */
  detailsForm!: FormGroup;
  locationForm!: FormGroup;
  audienceForm!: FormGroup;
  scheduleForm!: FormGroup;


  constructor(breakpointObserver: BreakpointObserver, private service: CampaignService, private route: Router, private activeRoute: ActivatedRoute, public matDialog: MatDialog) {

    /* change the orientation based on the with of the viewport */
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {

    /**
     * Get the index of existing object
     * When index is null,  this form will be used to create a new campaign object
     * When index is a number,  this form will be used to update the existing campaign object
     */

    const routerParam = this.activeRoute.snapshot.paramMap;
    this.index = Number(routerParam.get("index"));

    if (this.index != null) {

      /* fetch the data of existing campaign object */
      this.newCampaign = this.service.getExistingCampaign(this.index);
      this.initializeForm();

      /* populate the location FormArray with existing data */
      this.newCampaign.locations?.forEach((loc: string) => {
        (<FormArray>this.locationForm.get('locations')).push(new FormControl(loc));
      });
    }
    else {
      /* get a default campaign object from the service */
      this.newCampaign = this.service.getNewCampaign();
      this.initializeForm();
    }
  }


  initializeForm() {

    /* populate the details form with newCampaign data  */
    this.detailsForm = new FormGroup({
      name: new FormControl(this.newCampaign.name, Validators.required),
      objective: new FormControl(this.newCampaign.objective, Validators.required),
      category: new FormControl(this.newCampaign.category),
      offerType: new FormControl(this.newCampaign.offerType),
      comments: new FormControl(this.newCampaign.comments)

    });

    /* populate the location form with newCampaign data  */
    this.locationForm = new FormGroup({
      locations: new FormArray([], Validators.required),
      radius: new FormControl(this.newCampaign.radius, Validators.required)
    });
    this.audienceForm = new FormGroup({});

    /* populate the schedule form with newCampaign data  */
    this.scheduleForm = new FormGroup({
      startDate: new FormControl(this.newCampaign.startDate, Validators.required),
      endDate: new FormControl(this.newCampaign.endDate)
    });
  }

  /**
   * creates a new FormControl with locationValue
   * pushes the formControl to location FormArray
   */
  addLocation() {
    const control = new FormControl(this.locationValue);
    (<FormArray>this.locationForm.get('locations')).push(control);
    this.locationValue = '';
  }

  /**
   * @returns the location formArray as iterable 
   */
  getLocations() {
    return (<FormArray>this.locationForm.get('locations')).controls;
  }


  /**
   * removes the location at given index from location formArray
   * @param i index of the location in the formArray
   */
  removeControl(i: number) {
    (<FormArray>this.locationForm.get('locations')).removeAt(i);
  }

  /**
   * Assigns the values from the forms to the newCampaign object
   */
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



  /**
   * save the campaign details
   * when index is null,  a new campaign is created
   * when index is a number, existing data is updated
   */
  saveNewCampaign() {
    if (this.index == null)
      this.service.saveCampaignDetails(this.newCampaign);
    else
      this.service.saveCampaignDetails(this.newCampaign, Number(this.index));
    this.route.navigate(['/manage-campaign/list']);
  }


  /**
   * Open the dialog to confirm submission
   * pass the necessary details to display
   */
  openDialog() {
    this.dialogRef = this.matDialog.open(DialogComponent, {
      data: {
        heading: "Submit Campaign Details ",
        body: "Please check all the details provided are correct before Submitting",
        campaignData: null
      }
    });

    /**
     * Based on the emitted value from dialog  save the newCampaign data if flag is true
     * close the dialog
     */
    this.dialogRef.componentInstance.emitter.subscribe(flag => {
      if (flag)
        this.saveNewCampaign();
      this.dialogRef.close();
    });


  }

}
