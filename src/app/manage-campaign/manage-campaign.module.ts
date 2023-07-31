import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { ListCampaignComponent } from './list-campaign/list-campaign.component';
import { ManageCampaignRoutingModule } from './manage-campaign-routing.module';
import { ViewCampaignComponent } from './view-campaign/view-campaign.component';


@NgModule({
  declarations: [
    ListCampaignComponent,
    ViewCampaignComponent,
    CreateCampaignComponent,
  ],
  imports: [
    CommonModule,
    ManageCampaignRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class ManageCampaignModule { }
