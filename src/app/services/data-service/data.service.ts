import { Injectable, ApplicationRef, Output, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '@services/api-service/api.service';
import { Place } from '@interfaces/places.interface';
import { Weather, WeatherCurrent, WeatherMinutely, WeatherHourly, WeatherDaily } from '@interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private apiService: ApiService,
    private storage: Storage,
    private ref: ApplicationRef
  ) { }

  @Output() reload: EventEmitter<void> = new EventEmitter<void>();
  public loading: boolean;
  public data: Weather;
  public location: string = 'Select A Location';
  public lat: string;
  public long: string;
  public weatherCurrent: WeatherCurrent;
  public weatherMinutely: WeatherMinutely;
  public weatherHourly: WeatherHourly;
  public weatherDaily: WeatherDaily;

  getWeather(): Promise<boolean> {
    this.loading = true;
    return new Promise((resolve) => {
      this.apiService.getWeather(this.lat, this.long).subscribe((data) => {
        this.setData(data);
        console.log(this.location, data.currently.summary, data.currently.temperature);
        this.loading = false;
        this.ref.tick();
        this.reload.emit();
        resolve();
      });
    });
  }

  refreshWeather(): Promise<boolean> {
    console.log('refreshing weather');
    return this.getWeather().then((done) => {
      return done;
    })
  }

  setLocation(place: Place) {
    return new Promise((resolve) => {
      this.apiService.endPlacesSession();
      let location: any = {};
      this.apiService.getPlaceDetail(place).subscribe((data) => {
        let details = {
          location: this.getCity(data.result.address_components),
          lat: data.result.geometry.location.lat,
          long: data.result.geometry.location.lng
        }
        this.location = details.location;
        this.lat = details.lat;
        this.long = details.long;
        this.storage.set('setting:location', details).then((set) => {
          resolve();
        });
      });
    });
  }

  getLocationFromStorage() {
    return new Promise((resolve) => {
      this.storage.get(`setting:location`).then((data) => {
        this.location = data.location;
        this.lat = data.lat;
        this.long = data.long;
        resolve();
      });
    });
  }

  getCity(addressComponents: any): string {
    let cityName: string;
    let backupName: string;
    addressComponents.forEach((addressComponent) => {
      if (addressComponent.types.includes('locality')) {
        cityName = addressComponent.short_name;
      } else if (addressComponent.types.includes('administrative_area_level_1')) {
        backupName = addressComponent.long_name;
      } else if (addressComponent.types.includes('administrative_area_level_2')) {
        backupName = addressComponent.short_name;
      }
    });
    return cityName || backupName;
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
