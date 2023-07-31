import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { ListCampaignComponent } from './list-campaign/list-campaign.component';
import { ViewCampaignComponent } from './view-campaign/view-campaign.component';


const routes: Routes = [
  { path: 'campaign/list', component: ListCampaignComponent },
  { path: 'campaign/view/:id', component: ViewCampaignComponent },
  { path: 'campaign/create', component: CreateCampaignComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCampaignRoutingModule { }
