import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManageCampaignModule } from "./manage-campaign/manage-campaign.module";
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ManageCampaignModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
