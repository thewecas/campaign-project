import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { SnakBarComponent } from 'src/app/shared/snak-bar/snak-bar.component';
import * as audienceCategories from "../../../assets/data/audienceCategory.json";
import { CampaignService } from '../campaign.service';
import { ViewTemplateComponent } from '../view-template/view-template.component';




@Component({
  selector: 'app-create-campaign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatStepperModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, FormsModule, MatDatepickerModule, MatNativeDateModule, HeaderComponent, RouterModule, MatDialogModule, ViewTemplateComponent, MatSnackBarModule, MatCheckboxModule],
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
  id!: number | null; /* variable to store the id of existing object  */
  isDraft: boolean = false; /* variable to store status of draft checkbox */
  status!: string;

  /* forms to store the campaign data */
  detailsForm!: FormGroup;
  locationForm!: FormGroup;
  audienceForm!: FormGroup;
  scheduleForm!: FormGroup;


  constructor(breakpointObserver: BreakpointObserver, private service: CampaignService, private route: Router, private activeRoute: ActivatedRoute, public matDialog: MatDialog, private _snackBar: MatSnackBar) {

    /* change the orientation based on the with of the viewport */
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    /**
     * Get the id of existing object
     * When id is NaN, this form will be used to create a new campaign object
     * When id is a number, this form will be used to update the existing campaign object
     */
    const routerParam = this.activeRoute.snapshot.paramMap;
    this.id = Number(routerParam.get("id"));

    if (this.id > 0) {
      /* fetch the data of existing campaign object */
      this.newCampaign = this.service.getExistingCampaign(this.id);
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
      name: new FormControl(this.newCampaign.name, [Validators.required, Validators.pattern('[a-zA-Z0-9]+.*'), Validators.maxLength(40)]),
      objective: new FormControl(this.newCampaign.objective, [Validators.required, Validators.pattern('[a-zA-Z0-9]+.*'), Validators.maxLength(60)]),
      category: new FormControl(this.newCampaign.category),
      offerType: new FormControl(this.newCampaign.offerType),
      comments: new FormControl(this.newCampaign.comments, [Validators.pattern('[a-zA-Z0-9]+.*'), Validators.maxLength(100)])

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
    const control = new FormControl(this.locationValue, [Validators.required, Validators.pattern('[a-zA-Z0-9]+.*')]);
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
   * removes the location at given id from location formArray
   * @param index of the location in the formArray
   */
  removeControl(index: number) {
    (<FormArray>this.locationForm.get('locations')).removeAt(index);
  }

  /**
   * Assigns the values from the forms to the newCampaign object
   */
  summarizeNewCampaign() {
    this.isDraft = this.newCampaign.status == 'Draft' ? true : false;

    this.newCampaign = {
      ...this.newCampaign,
      name: this.detailsForm.value.name,
      objective: this.detailsForm.value.objective,
      category: this.detailsForm.value.category || 'Category 1',
      offerType: this.detailsForm.value.offerType || 'Offer 1',
      comments: this.detailsForm.value.comments || 'No Comments',
      locations: this.locationForm.value.locations,
      radius: this.locationForm.value.radius,
      status: (this.id && !this.isDraft) || !this.id ? this.service.getStatus(this.scheduleForm.value.startDate, this.scheduleForm.value.endDate) : 'Draft',
      startDate: this.scheduleForm.value.startDate,
      endDate: this.scheduleForm.value.endDate,
    };

  }

  toggleDraftStatus() {
    this.isDraft = !this.isDraft;
    this.newCampaign = {
      ...this.newCampaign,
      status: this.isDraft ? 'Draft' : this.service.getStatus(this.scheduleForm.value.startDate, this.scheduleForm.value.endDate)
    };
  }


  /**
   * save the campaign details
   * when id is null/NaN,  a new campaign is created
   * when id is a number, existing data is updated
   */
  saveNewCampaign() {
    this.service.saveCampaignDetails(this.newCampaign).subscribe({
      next: (res) => {
        this.openSnackBar();
        this.service.getDataFromDatabase();
        this.dialogRef.close();
        this.route.navigate(['/manage-campaign/list']);
      }
    });
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
      else {
        this.dialogRef.close();
      }
    });

  }

  /**
   * display the snakbar
   */
  openSnackBar() {
    this._snackBar.openFromComponent(SnakBarComponent, {
      duration: 3000,
      data: this.id ? "Updated the details successfully" : "Saved the Campaign data successfully"
    });
  }



}


