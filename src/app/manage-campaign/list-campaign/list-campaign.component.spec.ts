import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCampaignComponent } from './list-campaign.component';

describe('ListCampaignComponent', () => {
  let component: ListCampaignComponent;
  let fixture: ComponentFixture<ListCampaignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListCampaignComponent]
    });
    fixture = TestBed.createComponent(ListCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
