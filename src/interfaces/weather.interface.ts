export interface Weather {
    latitude: number;
    longitude: number;
    timezone: string;
    currently: WeatherCurrent;
    hourly: WeatherHourly;
    minutely: WeatherMinutely;
    daily: WeatherDaily;
}

export interface WeatherCurrent {
    time: number;
    summary: string;
    icon: string;
    nearestStormDistance: number;
    nearestStormBearing: number;
    precipIntensity: number;
    precipProbability: number;
    temperature: number;
    apparentTemperature: number;
    dewPoint: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windGust: number;
    windBearing: number;
    cloudCover: number;
    uvIndex: number;
    visibility: number;
    ozone: number;
}

export interface WeatherMinutely {
    summary: string;
    icon: string;
    data: DataMinutely[];
}

export interface WeatherHourly {
    summary: string;
    icon: string;
    data: DataHourly[];
}

export interface WeatherDaily {
    summary: string;
    icon: string;
    data: DataDaily[];
}

export interface DataMinutely {
    time: number;
    precipIntensity: number;
    precipProbability: number;
}

export interface DataHourly {
    time: number;
    summary: string;
    icon: string;
    precipIntensity: number;
    precipProbability: number;
    temperature: number;
    apparentTemperature: number;
    dewPoint: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windGust: number;
    windBearing: number;
    cloudCover: number;
    uvIndex: number;
    visibility: number;
    ozone: number;
    expanded: boolean;
}

export interface DataDaily {
    time: number;
    summary: string;
    icon: string;
    sunriseTime: number;
    sunsetTime: number;
    moonPhase: number;
    precipIntensity: number;
    precipIntensityMax: number;
    precipIntensityMaxTime: number;
    precipProbability: number;
    precipType: string;
    temperatureHigh: number;
    temperatureHighTime: number;
    temperatureLow: number;
    temperatureLowTime: number;
    apparentTemperatureHigh: number;
    apparentTemperatureHighTime: number;
    apparentTemperatureLow: number;
    apparentTemperatureLowTime: number;
    dewPoint: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windGust: number;
    windGustTime: number;
    windBearing: number;
    cloudCover: number;
    uvIndex: number;
    uvIndexTime: number;
    visibility: number;
    ozone: number;
    temperatureMin: number;
    temperatureMinTime: number;
    temperatureMax: number;
    temperatureMaxTime: number;
    apparentTemperatureMin: number;
    apparentTemperatureMinTime: number;
    apparentTemperatureMax: number;
    apparentTemperatureMaxTime: number;
    expanded: boolean;
}