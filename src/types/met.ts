export interface MetForecastResponse {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number, number];
  };
  properties: {
    meta: {
      updated_at: string;
      units: {
        air_pressure_at_sea_level: string;
        air_temperature: string;
        cloud_area_fraction: string;
        precipitation_amount: string;
        relative_humidity: string;
        wind_from_direction: string;
        wind_speed: string;
        [key: string]: string;
      };
    };
    timeseries: MetTimeSeries[];
  };
}

export interface MetTimeSeries {
  time: string;
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level: number;
        air_temperature: number;
        cloud_area_fraction: number;
        relative_humidity: number;
        wind_from_direction: number;
        wind_speed: number;
        [key: string]: number;
      };
    };
    next_12_hours?: MetForecastSummary;
    next_1_hours?: MetForecastSummary & { details?: { precipitation_amount?: number } };
    next_6_hours?: MetForecastSummary & { details?: { precipitation_amount?: number } };
  };
}

export interface MetForecastSummary {
  summary: {
    symbol_code: string;
  };
  details?: {
    precipitation_amount?: number;
  };
}
