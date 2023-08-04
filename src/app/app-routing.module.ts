import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'manage-campaign/list', pathMatch: 'full'
  },
  {
    path: 'manage-campaign/list',
    loadComponent: () => import('./manage-campaign/list-campaign/list-campaign.component').then(m => m.ListCampaignComponent)
  },
  {
    path: 'manage-campaign/view/:index',
    loadComponent: () => import('./manage-campaign/view-campaign/view-campaign.component').then(m => m.ViewCampaignComponent)
  },
  {
    path: 'manage-campaign/create',
    loadComponent: () => import('./manage-campaign/create-campaign/create-campaign.component').then(m => m.CreateCampaignComponent)
  },
  {
    path: 'manage-campaign/update/:index',
    loadComponent: () => import('./manage-campaign/create-campaign/create-campaign.component').then(m => m.CreateCampaignComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
