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
  public degree: string;

  constructor(
    private weatherService: WeatherService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.getComponentWeatherData();
    this.dataService.reload.subscribe(() => {
      this.getComponentWeatherData();
    });
  }

  getComponentWeatherData() {
    this.weatherCurrent = this.dataService.getCurrentWeather();
    this.setDegree();
    this.scaleFontSize('div.desc p');
  }

  scaleFontSize(element): void {
    setTimeout(() => {
      const container = document.querySelectorAll(element)[0];
      container.style.fontSize = '28px';
      if (container.textContent.length > 16) {
          container.style.fontSize = '20px';
      }
    }, 150);
  }

  setDegree() {
    this.degree = this.weatherService.theme === 'retro' ? '°' : '';
  }

  toggleMinuteCard(): void {
    this.minutelyCard.emit();
  }
}
