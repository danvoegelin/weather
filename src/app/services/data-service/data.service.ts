import { Injectable, ApplicationRef, Output, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '@services/api-service/api.service';
import { Place, SavedLocations, Location } from '@interfaces/places.interface';
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
  public currentLocation: Location;
  public loading: boolean;
  public data: Weather;
  public location: string = 'Select A Location';
  public lat: number;
  public long: number;
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

  setSavedLocation(location: any) {
    return new Promise((resolve) => {
      this.storage.set('setting:location', location).then((set) => {
        this.setThisLocation(location);
        resolve(location);
      });
    });
  }

  getLocationFromStorage() {
    return new Promise((resolve) => {
      this.storage.get(`setting:location`).then((data) => {
        if (data) {
          this.setThisLocation(data);
        }
        resolve(data);
      });
    });
  }

  setThisLocation(location: Location) {
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

  saveLocationToStorage() {
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

  locationIsntSaved(savedLocations: Location[], location: Location) {
    let matchingLocations = savedLocations.filter((loc) => {
      return loc.place_id === location.place_id;
    });
    return !matchingLocations.length
  }

  getSavedLocationsFromStorage() {
    return new Promise((resolve) => {
      this.storage.get('setting:savedLocations').then((savedLocations) => {
        resolve(savedLocations);
      });
    });
  }

  removeSavedLocationFromStorage(location: Location) {
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
