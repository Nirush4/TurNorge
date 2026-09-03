import { NORWEGIAN_REGIONS, type KartverketPlace } from '@/types/schemas';
import type { NorwegianRegion } from '@/types';

const PLACES: KartverketPlace[] = [
  {
    ssrId: 'SSR-1501',
    name: 'Gjendesheim',
    municipality: 'Vågå',
    county: 'Innlandet',
    region: 'Jotunheimen',
    latitude: 61.493,
    longitude: 8.81,
    mapSheet: 'N50-1617-IV',
  },
  {
    ssrId: 'SSR-2210',
    name: 'Sognsvann',
    municipality: 'Oslo',
    county: 'Oslo',
    region: 'Nordmarka',
    latitude: 59.973,
    longitude: 10.729,
    mapSheet: 'N50-1914-III',
  },
  {
    ssrId: 'SSR-3302',
    name: 'Finse',
    municipality: 'Ulvik',
    county: 'Vestland',
    region: 'Hardangervidda',
    latitude: 60.602,
    longitude: 7.504,
    mapSheet: 'N50-1415-I',
  },
  {
    ssrId: 'SSR-4411',
    name: 'Reine',
    municipality: 'Moskenes',
    county: 'Nordland',
    region: 'Lofoten',
    latitude: 67.932,
    longitude: 13.089,
    mapSheet: 'N50-1231-II',
  },
  {
    ssrId: 'SSR-5520',
    name: 'Rondvassbu',
    municipality: 'Sel',
    county: 'Innlandet',
    region: 'Rondane',
    latitude: 61.875,
    longitude: 9.795,
    mapSheet: 'N50-1718-II',
  },
  {
    ssrId: 'SSR-6634',
    name: 'Lyngseidet',
    municipality: 'Lyngen',
    county: 'Troms',
    region: 'Lyngsalpene',
    latitude: 69.576,
    longitude: 20.219,
    mapSheet: 'N50-1634-I',
  },
  {
    ssrId: 'SSR-7745',
    name: 'Gjevilvasshytta',
    municipality: 'Oppdal',
    county: 'Trøndelag',
    region: 'Trollheimen',
    latitude: 62.689,
    longitude: 9.382,
    mapSheet: 'N50-1520-IV',
  },
  {
    ssrId: 'SSR-8856',
    name: 'Preikestolen',
    municipality: 'Strand',
    county: 'Rogaland',
    region: 'Lysefjorden',
    latitude: 58.986,
    longitude: 6.188,
    mapSheet: 'N50-1212-III',
  },
];

export function listKartverketPlaces(): KartverketPlace[] {
  return PLACES;
}

export function getKartverketPlaceByRegion(region: NorwegianRegion): KartverketPlace {
  const match = PLACES.find((place) => place.region === region);
  if (!match) {
    return PLACES[0];
  }
  return match;
}

export function isNorwegianRegion(value: string): value is NorwegianRegion {
  return (NORWEGIAN_REGIONS as readonly string[]).includes(value);
}
