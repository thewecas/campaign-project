import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    /**
     * redirect the default path to `manage-campaign/list`
     */
    path: '', redirectTo: 'manage-campaign/list', pathMatch: 'full'
  },
  {
    /**
     * route to list of campaign data
     * lazy load the component
     */
    path: 'manage-campaign/list',
    loadComponent: () => import('./manage-campaign/list-campaign/list-campaign.component').then(m => m.ListCampaignComponent)
  },
  {
    /**
     * route to view details of individual campaign
     * lazy load the component
     */
    path: 'manage-campaign/view/:index',
    loadComponent: () => import('./manage-campaign/view-campaign/view-campaign.component').then(m => m.ViewCampaignComponent)
  },
  {
    /**
     * route to update the existing campaign data, reuses the createCampaignProject
     * lazy load the component
     */
    path: 'manage-campaign/update/:index',
    loadComponent: () => import('./manage-campaign/create-campaign/create-campaign.component').then(m => m.CreateCampaignComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
