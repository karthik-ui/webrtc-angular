import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [AgGridModule],
  template: `
    <ag-grid-angular
      class="ag-theme-alpine"
      [rowData]="statsData"
      [columnDefs]="columnDefs"
      [pagination]="true"
      [paginationPageSize]="10"
      [domLayout]="'autoHeight'">
    </ag-grid-angular>
  `
})
export class StatsComponent {
  statsData = [
    { type: 'bitrate', value: '2 Mbps' },
    { type: 'packetsLost', value: 0 },
    { type: 'jitter', value: '5 ms' }
  ];

  columnDefs = [
    { field: 'type', pinned: 'left' },
    { field: 'value' }
  ];
}