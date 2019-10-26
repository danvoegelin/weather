import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WeatherCurrent } from '@interfaces/weather.interface';

import { WeatherService } from '@services/weather-service/weather.service';
import { DataService } from '@services/data-service/data.service';

@Component({
  selector: 'main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss']
})
export class MainCardComponent implements OnInit {

  @Output() minutelyCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  public weatherCurrent: WeatherCurrent;
  public loading: boolean = true;

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.reload.subscribe(() => {
      this.loading = true;
      this.weatherCurrent = this.dataService.getCurrentWeather();
      this.loading = false;
      this.scaleFontSize('div.desc p');
    });
  }

  scaleFontSize(element): void {
    setTimeout(function(){
      var container = document.querySelectorAll(element)[0];
      container.style.fontSize = '28px';
      if (container.textContent.length > 16) {
          container.style.fontSize = '20px';
      }
    }, 150);
  }

  toggleMinuteCard(): void {
    this.minutelyCard.emit();
  }
}
