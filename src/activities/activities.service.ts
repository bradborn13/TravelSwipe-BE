import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { FoursquarePlace } from './dto/interfaces';
import { mapFoursquareLocation } from './mappers/foursquare-location.mapper';
import { FoursquareLocationDto } from './dto/foursquare-location.dto';
import { getJson } from 'serpapi';
import { ActivitiesRepository } from './activities.repository';
import { Activities } from '../infrastructure/activities.schema';
import { CityRepository } from 'src/city/city.repository';
import { CountryRepository } from 'src/country/country.repository';
import { City } from 'src/infrastructure/city.schema';
import { Country } from 'src/infrastructure/country.schema';
import slugify from 'slugify';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activitiesRepo: ActivitiesRepository,
    private readonly countryRepo: CountryRepository,
    private readonly cityRepo: CityRepository,
  ) {}

  async scrapePhotoForLocation(city: string) {
    const amountOfPhotos = 6;
    const activitiesByCity = await this.activitiesRepo.findWithoutImages(city);
    if (activitiesByCity.length === 0) {
      console.log(
        `Attractions for ${city} contain photos already, skipping scraping.`,
      );
      return [];
    }

    const updatedLocationsImages: { name: string; city: string }[] =
      activitiesByCity.map((location) => {
        return { name: location.name, city: location.city };
      });

    await Promise.all(
      updatedLocationsImages.map(async (activity) => {
        const photos = await this.scrapePhotosForActivity(
          activity.name,
          activity.city,
          amountOfPhotos,
        );
        await this.activitiesRepo.updateImagesURL(
          activity.name,
          activity.city,
          photos,
        );
      }),
    );
  }

  async findCountryForActivities() {
    const citiesWOCountries =
      await this.activitiesRepo.findActivitiesWithoutCountries();
    const countries: Country[] = [];
    const cities: City[] = [];
    await Promise.all(
      citiesWOCountries.map(async (city: Activities) => {
        try {
          const response: any = await axios({
            method: 'GET',
            url: `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${city.latitude}&lon=${city.longitude}`,
            params: {},
            headers: {
              'User-Agent': 'TravelSwipe-App',
            },
          });
          const countryFormated = slugify(response.data?.address.country, {
            lower: true,
            strict: true,
            trim: true,
          });
          if (!countries.some((x) => x.nameClean === countryFormated)) {
            countries.push({
              countryCode: response.data?.address?.country_code ?? '',
              name: [response.data?.address.country],
              nameClean: countryFormated,
            });
          }

          if (response?.data?.address?.city) {
            const cityFormated = slugify(response?.data?.address?.city, {
              lower: true,
              strict: true,
              trim: true,
            });
            if (!cities.some((x) => x.nameClean === cityFormated)) {
              cities.push({
                country: countryFormated,
                municipality: response.data.address.municipality,
                name: [response.data.address.city, city.city],
                nameClean: cityFormated,
                postcode: response.data.address.postcode,
                state: response?.data?.address?.state?.split(',') ?? [],
              });
            }
          }
        } catch (err) {
          console.log(err, 'error');
        }
      }),
    );
    await this.cityRepo.saveCities(cities);
    await this.countryRepo.saveCountries(countries);
  }
  async scrapePhotosForActivity(
    activity: string,
    location: string,
    amountOfPhotos: number,
  ) {
    try {
      const response = await getJson({
        engine: 'google_images',
        api_key: process.env.SERPAPI_KEY,
        q: activity,
        location: location,
        gl: 'us',
        hl: 'en',
      });

      const results = response.images_results || [];
      return results.slice(0, amountOfPhotos).map((img: any) => ({
        image: img.original,
        originalHeight: img.original_height,
        originalWidth: img.original_width,
        thumbnail: img.thumbnail,
        title: img.title,
        source: img.source,
        link: img.link,
        position: img.position,
        imgSource: img.source,
      }));
    } catch (error) {
      console.error('SerpApi failed:', error);
      return [];
    }
  }

  async getActivities(city: string) {
    const locationsByCity = await this.activitiesRepo.findActivity({
      city: city,
    });
    if (locationsByCity.length > 0) {
      return locationsByCity;
    } else {
      return await this.SearchAndStoreActivities(city);
    }
  }

  async FetchFourSquareLocations(city: string): Promise<FoursquarePlace[]> {
    try {
      const response = await axios({
        method: 'GET',
        url: `${process.env.FOURSQUARE_BASE_URL}/places/search`,
        params: {
          near: city,
        },
        headers: {
          'X-Places-Api-Version': '2025-06-17',
          Authorization: `Bearer ${process.env.Foursquare_API}`,
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('FSQ error detail:', err.response?.data);
      }
      return [];
    }
  }
  async SearchAndStoreActivities(city: string) {
    const rawResults: any = await this.FetchFourSquareLocations(city);
    if (!rawResults?.results || !Array.isArray(rawResults.results)) {
      console.error('Unexpected FSQ response structure:', rawResults);
      return [];
    }
    if (rawResults.results.length === 0) {
      console.log(`No activities found for city: ${city}`);
      return [];
    }
    const mappedActivities: Activities[] = rawResults.results.map(
      (item: FoursquareLocationDto) => mapFoursquareLocation(item, city),
    );
    await this.activitiesRepo.bulkInsert(mappedActivities);
    const locationsByCity = await this.activitiesRepo.findActivity({
      city: city,
    });
    return locationsByCity;
  }
}
