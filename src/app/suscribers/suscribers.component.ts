import { Component, OnInit } from '@angular/core';
import { SubsService } from '../services/subs.service';

@Component({
  selector: 'app-suscribers',
  templateUrl: './suscribers.component.html',
  styleUrls: ['./suscribers.component.css'],
})
export class SuscribersComponent implements OnInit {
  subData!: Array<any>;

  constructor(private subService: SubsService) {}
  ngOnInit(): void {
    this.subService.loadData().subscribe((val) => {
      console.log(val);
      this.subData = val;

      console.log(this.subData);
    });
  }
  deleteSubs(id: any) {
    this.subService.deleteData(id);
  }
}
