import { Injectable, ApplicationRef, Output, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '@services/api-service/api.service';
import { WeatherService } from '@services/weather-service/weather.service';
import { Place, SavedLocations, Location } from '@interfaces/places.interface';
import { Weather, WeatherCurrent, WeatherMinutely, WeatherHourly, WeatherDaily } from '@interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private weatherService: WeatherService,
    private apiService: ApiService,
    private storage: Storage,
    private ref: ApplicationRef
  ) { }

  @Output() reload: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshing: EventEmitter<boolean> = new EventEmitter<boolean>();
  public currentLocation: Location;
  public data: Weather;
  public location: string = 'Select A Location';
  public lat: number;
  public long: number;
  public weatherCurrent: WeatherCurrent;
  public weatherMinutely: WeatherMinutely;
  public weatherHourly: WeatherHourly;
  public weatherDaily: WeatherDaily;

  getWeather(): Promise<Weather> {
    return new Promise((resolve) => {
      this.apiService.getWeather(this.lat, this.long).subscribe((data) => {
        this.setData(data);
        console.log(this.location, data.currently.summary, data.currently.temperature);
        this.ref.tick();
        this.reload.emit();
        resolve(data);
      });
    });
  }

  refreshWeather(): Promise<boolean> {
    this.refreshing.emit(true);
    return this.getWeather().then(() => {
      this.refreshing.emit(false);
      return true;
    });
  }

  setLocation(place: Place): Promise<Location> {
    return new Promise((resolve) => {
      this.apiService.endPlacesSession();
      let location: any = {};
      this.apiService.getPlaceDetail(place).subscribe((data) => {
        let details = {
          location: this.getLocationName(data.result.address_components),
          lat: data.result.geometry.location.lat,
          long: data.result.geometry.location.lng,
          place_id: place.place_id
        }
        this.setThisLocation(details)
        this.storage.set('setting:location', details).then((set) => {
          resolve(details);
        });
      });
    });
  }

  setSavedLocation(location: any): Promise<Location> {
    return new Promise((resolve) => {
      this.storage.set('setting:location', location).then((set) => {
        this.setThisLocation(location);
        resolve(location);
      });
    });
  }

  getLocationFromStorage(): Promise<Location> {
    return new Promise((resolve) => {
      this.storage.get(`setting:location`).then((data) => {
        if (data) {
          this.setThisLocation(data);
        }
        resolve(data);
      });
    });
  }

  setThisLocation(location: Location): void {
      this.currentLocation = location;
      this.location = location.location;
      this.lat = location.lat;
      this.long = location.long;
  }

  getLocationName(addressComponents: any): string {
    let locationObject: any = {};
    addressComponents.forEach((addressComponent) => {
      if (addressComponent.types.includes('neighborhood')) {
        locationObject.neighborhood = addressComponent.long_name;
      }
      if (addressComponent.types.includes('sublocality')) {
        locationObject.sublocality = addressComponent.long_name;
      }
      if (addressComponent.types.includes('natural_feature')) {
        locationObject.natural_feature = addressComponent.long_name;
      }
      if (addressComponent.types.includes('locality')) {
        locationObject.locality = addressComponent.long_name;
      }
      if (addressComponent.types.includes('administrative_area_level_1')) {
        locationObject.administrative_area_level_1 = addressComponent.long_name;
      }
      if (addressComponent.types.includes('country')) {
        locationObject.country = addressComponent.long_name;
      }
    });
    return locationObject.neighborhood || locationObject.sublocality || locationObject.natural_feature || locationObject.locality || locationObject.administrative_area_level_1 || locationObject.country || 'unknown';
  }

  saveLocationToStorage(): Promise<any> {
    return new Promise((resolve) => {
      this.getSavedLocationsFromStorage().then((savedLocations: Location[]) => {
        let newLocation = { locations: [this.currentLocation] };
        let newLocationList: Location[];
        if (savedLocations === null) {
          newLocationList = [this.currentLocation];
        } else if (this.locationIsntSaved(savedLocations, this.currentLocation)) {
          newLocationList = savedLocations.concat(this.currentLocation);
        } else {
          newLocationList = savedLocations;
        }
        this.storage.set('setting:savedLocations', newLocationList).then((set) => {
          resolve();
        });
      });
    });
  }

  locationIsntSaved(savedLocations: Location[], location: Location): boolean {
    let matchingLocations = savedLocations.filter((loc) => {
      return loc.place_id === location.place_id;
    });
    return !matchingLocations.length
  }

  getSavedLocationsFromStorage(): Promise<Location[]> {
    return new Promise((resolve) => {
      this.storage.get('setting:savedLocations').then((savedLocations) => {
        resolve(savedLocations);
      });
    });
  }

  saveTheme(theme: string) {
    this.storage.set('setting:theme', { theme: theme } );
  }

  getSavedTheme(): Promise<string> {
    return new Promise((resolve) => {
      this.storage.get('setting:theme').then((savedTheme) => {
        let theme = savedTheme ? savedTheme.theme : 'light';
        resolve(theme);
      });
    });
  }

  removeSavedLocationFromStorage(location: Location): Promise<any> {
    return new Promise((resolve) => {
      this.getSavedLocationsFromStorage().then((savedLocations: Location[]) => {
        let newLocationList = savedLocations.filter((loc) => {
          return loc.place_id !== location.place_id;
        });
        this.storage.set('setting:savedLocations', newLocationList).then((set) => {
          resolve();
        });
      });
    });
  }

  setData(data: Weather): void {
    data = this.amendData(data);
    this.data = this.filterData(data);
    this.weatherCurrent = data.currently;
    this.weatherMinutely = data.minutely;
    this.weatherHourly = data.hourly;
    this.weatherDaily = data.daily;
  }

  filterData(data: Weather): Weather {
    data.hourly.data = data.hourly.data.slice(0, 24);
    data.currently.icon = this.weatherService.getWeatherIcon(data.currently);
    for (let i = 0; i < data.daily.data.length; i++) {
      data.daily.data[i].icon = this.weatherService.getWeatherIcon(data.daily.data[i]);
    }
    for (let i = 0; i < data.hourly.data.length; i++) {
      data.hourly.data[i].icon = this.weatherService.getWeatherIcon(data.hourly.data[i]);
    }
    return data;
  }

  amendData(data: Weather): Weather {
    data.currently.windDirection = this.weatherService.getWindBearing(data.currently.windBearing);
    data.currently.totalPrecip = this.weatherService.getTotalPrecip(data.currently);
    data.currently.uvIndexValue = this.weatherService.getUVIndexValue(data.currently);
    data.currently.uvIndexClass = this.weatherService.getUVIndexClass(data.currently.uvIndexValue);
    for (let i = 0; i < data.daily.data.length; i++) {
      data.daily.data[i].totalPrecip = this.weatherService.getTotalPrecip(data.daily.data[i]);
    }
    if (data.minutely) {
      for (let i = 0; i < data.minutely.data.length; i++) {
        data.minutely.data[i].chartHeight = this.weatherService.getMinutelyChartHeight(data.minutely.data[i]);
        if (data.minutely.rainStarting === undefined && parseInt(data.minutely.data[i].chartHeight) > 0) {
          data.minutely.rainStarting = i;
        }
      }
    }
    return data
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
