import { Component, OnInit } from '@angular/core';
import { WebRTCService } from '../services/webrtc.service';

@Component({
  selector: 'app-stats',
  template: `<ag-grid-angular
  class="ag-theme-quartz"
  style="width: 100%; height: 300px;"
  [rowData]="rowData"
  [columnDefs]="columnDefs"
  [paginationPageSize]="10"
  [paginationPageSizeSelector]="[10,20,50,100]"
  pagination="true">
</ag-grid-angular>`,
  styles: `:host {
  display: block;
  margin-top: 1rem;
} `
})
export class StatsComponent implements OnInit {
  rowData: any[] = [];
  columnDefs = [
    { headerName: 'Metric', field: 'type', flex: 1 },
    { headerName: 'Value', field: 'value', flex: 1 }
  ];

  constructor(private webRTCService: WebRTCService) {}

  ngOnInit() {
    // Poll stats every 2 seconds
    setInterval(async () => {
      this.rowData = await this.webRTCService.getStats();
    }, 2000);
  }
}