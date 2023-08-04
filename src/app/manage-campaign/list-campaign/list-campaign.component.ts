import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/header/header.component';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-list-campaign',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatSortModule, MatMenuModule, HeaderComponent],
  templateUrl: './list-campaign.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class ListCampaignComponent implements AfterViewInit, OnInit {

  public campaignData !: any[];
  public dataSource!: MatTableDataSource<any>;
  title = 'Manage Campaign';

  columnsToDisplay = ['id', 'name', 'status', 'ctr', 'startDate', 'actions'];

  constructor(private service: CampaignService) {
  }

  ngOnInit(): void {
    this.service.getAllCampaigns().subscribe(res => {
      this.campaignData = res.map((ele: any) => {
        return {
          id: ele.id,
          name: ele.name,
          status: ele.status,
          ctr: ele.ctr || 0,
          startDate: new Date(ele.startDate)
        };
      }) || [];
      this.dataSource = new MatTableDataSource(this.campaignData);
    });
  }

  ngAfterViewInit(): void {
    // this.dataSource.data = this.campaignData;
    this.dataSource.sort = this.sort;
  };


  @ViewChild(MatSort) sort!: MatSort;

}
