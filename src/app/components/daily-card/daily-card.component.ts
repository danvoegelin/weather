import { Component, OnInit, Input } from '@angular/core';

import { WeatherDaily } from '@interfaces/weather.interface';

import { WeatherService } from '@services/weather-service/weather.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'daily-card',
  templateUrl: './daily-card.component.html',
  styleUrls: ['./daily-card.component.scss'],
})
export class DailyCardComponent implements OnInit {

  public weatherDaily: WeatherDaily;
  public loading: boolean = true;

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.reload.subscribe(() => {
      this.loading = true;
      this.weatherDaily = this.dataService.getDailyWeather();
      this.loading = false;
    });
  }

  expandItem(day: any): void {
    if (day.expanded) {
      day.expanded = false;
    } else {
      this.weatherDaily.data.map(dayItem => {
        if (day == dayItem) {
          dayItem.expanded = !dayItem.expanded;
        } else {
          dayItem.expanded = false;
        }
      });
    }
  }
}
