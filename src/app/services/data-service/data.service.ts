import { Injectable } from '@angular/core';
import { ApiService } from '@services/api-service/api.service'
import { Weather, WeatherCurrent, WeatherMinutely, WeatherHourly, WeatherDaily } from '@interfaces/weather.interface'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private apiService: ApiService
  ) { }

  public loading: boolean;
  public data: Weather;
  public lat: string = '42.358223';
  public long: string = '-71.071096';
  public weatherCurrent: WeatherCurrent;
  public weatherMinutely: WeatherMinutely;
  public weatherHourly: WeatherHourly;
  public weatherDaily: WeatherDaily;

  refreshWeather() {
    console.log('mock refreshing')
  }

  setData(data: Weather) {
    this.data = data;
    this.weatherCurrent = data.currently;
    this.weatherMinutely = data.minutely;
    this.weatherHourly = data.hourly;
    this.weatherDaily = data.daily;
  }

  getCurrentWeather(): WeatherCurrent {
    return this.weatherCurrent;
  }

  getMinutelyWeather(): WeatherMinutely {
    return this.weatherMinutely;
  }

  getHourlyWeather(): WeatherHourly {
    return this.weatherHourly;
  }

  getDailyWeather(): WeatherDaily {
    return this.weatherDaily;
  }
}
