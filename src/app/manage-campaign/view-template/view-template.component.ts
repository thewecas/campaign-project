import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-template.component.html',
  styleUrls: ['../campaign.style.scss']
})
export class ViewTemplateComponent {
  @Input() campaign: any;
}
