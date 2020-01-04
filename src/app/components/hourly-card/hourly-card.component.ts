import { Component, OnInit, Input } from '@angular/core';

import { WeatherHourly } from '@interfaces/weather.interface';

import { WeatherService } from '@services/weather-service/weather.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'hourly-card',
  templateUrl: './hourly-card.component.html',
  styleUrls: ['./hourly-card.component.scss'],
})
export class HourlyCardComponent implements OnInit {

  @Input() minutelyCard: boolean;
  public weatherHourly: WeatherHourly;
  public staggerFunction = this.staggerDropIn();

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.weatherHourly = this.dataService.getHourlyWeather();
    this.dataService.reload.subscribe(() => {
      this.weatherHourly = this.dataService.getHourlyWeather();
    });
  }

  staggerDropIn(): any {
    return () => {
      const items = document.querySelectorAll('ion-item.hourly');
      for (let i = 0; i < items.length; i++) {
        setTimeout(() => { items[i].classList.toggle('slide-in'); }, i * 50);
        setTimeout(() => { items[i].classList.toggle('hide'); }, i * 50);
      }
    };
  }

  expandItem(hour: any): void {
    if (hour.expanded) {
      hour.expanded = false;
    } else {
      this.weatherHourly.data.map(hourItem => {
        if (hour === hourItem) {
          hourItem.expanded = !hourItem.expanded;
        } else {
          hourItem.expanded = false;
        }
        return hourItem;
      });
    }
  }
}
