import type { NorwegianRegion } from '@/types';
import type { MetLocationForecast } from '@/types/schemas';
import { getKartverketPlaceByRegion } from '@/api/kartverket';

interface ClimateProfile {
  temperatureC: number;
  windMs: number;
  humidity: number;
  precipitationMm: number;
  symbol: string;
}

const REGION_CLIMATE: Record<NorwegianRegion, ClimateProfile> = {
  Jotunheimen: {
    temperatureC: 6,
    windMs: 7,
    humidity: 78,
    precipitationMm: 1.2,
    symbol: 'partlycloudy_day',
  },
  Nordmarka: {
    temperatureC: 12,
    windMs: 3,
    humidity: 70,
    precipitationMm: 0.4,
    symbol: 'fair_day',
  },
  Hardangervidda: {
    temperatureC: 4,
    windMs: 9,
    humidity: 82,
    precipitationMm: 2.1,
    symbol: 'lightrain',
  },
  Lofoten: {
    temperatureC: 9,
    windMs: 8,
    humidity: 84,
    precipitationMm: 1.8,
    symbol: 'rainshowers_day',
  },
  Rondane: {
    temperatureC: 5,
    windMs: 6,
    humidity: 72,
    precipitationMm: 0.6,
    symbol: 'fair_day',
  },
  Lyngsalpene: {
    temperatureC: 3,
    windMs: 10,
    humidity: 80,
    precipitationMm: 1.4,
    symbol: 'cloudy',
  },
  Trollheimen: {
    temperatureC: 7,
    windMs: 5,
    humidity: 76,
    precipitationMm: 1.0,
    symbol: 'partlycloudy_day',
  },
  Lysefjorden: {
    temperatureC: 11,
    windMs: 4,
    humidity: 74,
    precipitationMm: 2.4,
    symbol: 'rainshowers_day',
  },
};

function hoursFromNow(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() + hours, 0, 0, 0);
  return date.toISOString();
}

export function getMockMetForecast(region: NorwegianRegion): MetLocationForecast {
  const climate = REGION_CLIMATE[region];
  const place = getKartverketPlaceByRegion(region);

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [place.longitude, place.latitude, 0],
    },
    properties: {
      meta: {
        updated_at: new Date().toISOString(),
        units: {
          air_temperature: 'celsius',
          wind_speed: 'm/s',
          precipitation_amount: 'mm',
          relative_humidity: 'percent',
        },
      },
      timeseries: [0, 6, 12, 18, 24, 30].map((hourOffset, index) => ({
        time: hoursFromNow(hourOffset),
        data: {
          instant: {
            details: {
              air_temperature: climate.temperatureC + Math.sin(index) * 1.6,
              wind_speed: Math.max(1, climate.windMs - index * 0.3),
              relative_humidity: Math.min(95, climate.humidity + index),
              wind_from_direction: 220 + index * 8,
              cloud_area_fraction: 45 + index * 6,
            },
          },
          next_6_hours: {
            summary: { symbol_code: climate.symbol },
            details: {
              precipitation_amount: Math.max(0, climate.precipitationMm - index * 0.15),
            },
          },
        },
      })),
    },
  };
}

export function summarizeForecast(forecast: MetLocationForecast): {
  temperatureC: number;
  windMs: number;
  precipitationMm: number;
  symbol: string;
  updatedAt: string;
} {
  const first = forecast.properties.timeseries[0];
  return {
    temperatureC: first.data.instant.details.air_temperature,
    windMs: first.data.instant.details.wind_speed,
    precipitationMm: first.data.next_6_hours?.details?.precipitation_amount ?? 0,
    symbol: first.data.next_6_hours?.summary.symbol_code ?? 'cloudy',
    updatedAt: forecast.properties.meta.updated_at,
  };
}
