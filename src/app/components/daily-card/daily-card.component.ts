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

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.weatherDaily = this.dataService.getDailyWeather();
    this.dataService.reload.subscribe(() => {
      this.weatherDaily = this.dataService.getDailyWeather();
    });
  }

  expandItem(day: any): void {
    if (day.expanded) {
      day.expanded = false;
    } else {
      this.weatherDaily.data.map(dayItem => {
        if (day === dayItem) {
          dayItem.expanded = !dayItem.expanded;
          if (day.time === this.weatherDaily.data[this.weatherDaily.data.length - 1].time) {
            setTimeout(() => {
              const lastItem = document.querySelectorAll('daily-card ion-list ion-item .expand-wrapper')[7];
              lastItem.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
            }, 400);
          }
        } else {
          dayItem.expanded = false;
        }
      });
    }
  }
}
