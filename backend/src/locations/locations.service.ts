import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { Model } from 'mongoose';
import { Location } from './infrastructure/schemas/location.schema';
import { FoursquarePlace } from './dto/interfaces';
import { mapFoursquareLocation } from './mappers/foursquare-location.mapper';
import { FoursquareLocationDto } from './dto/foursquare-location.dto';
import { getJson } from 'serpapi';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}
  async scrapePhotoForLocation(city: string) {
    const amountOfPhotos = 6;
    const activitiesByCity = await this.locationModel
      .find({
        city,
        $or: [
          { imagesURL: { $exists: false } },
          { imagesURL: { $size: 0 } },
          { imagesURL: null },
        ],
      })
      .exec();
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

    updatedLocationsImages.map(async (activity) => {
      const photos = await this.scrapePhotosForActivity(
        activity.name,
        activity.city,
        amountOfPhotos,
      );
      await this.locationModel.updateOne(
        { name: activity.name, city: activity.city },
        { imagesURL: photos },
      );
    });
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
        gl: 'us', // Google Country
        hl: 'en', // Google Language
      });

      const results = response.images_results || [];
      console.log('SerpApi results:', results);
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

  async getLocations(city: string) {
    const locationsByCity = await this.locationModel.find({ city }).exec();
    console.log(`Found ${locationsByCity.length} locations for city: ${city}`);
    if (locationsByCity.length > 0) {
      return locationsByCity;
    } else {
      return await this.SearchAndSaveLocations(city);
    }
  }

  async FetchFourSquareLocations(city: string): Promise<FoursquarePlace[]> {
    try {
      console.log(
        'variable check :',
        `${process.env.FOURSQUARE_BASE_URL}/places/search`,
      );
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
  async SearchAndSaveLocations(city: string) {
    const rawResults: any = await this.FetchFourSquareLocations(city);
    console.log('Raw results:', rawResults);
    if (!rawResults?.results || !Array.isArray(rawResults.results)) {
      console.error('Unexpected FSQ response structure:', rawResults);
      return []; // Return empty instead of crashing
    }
    const mappedLocations = rawResults.results.map(
      (item: FoursquareLocationDto) => mapFoursquareLocation(item, city),
    );
    if (mappedLocations.length > 0) {
      await this.locationModel.insertMany(mappedLocations);
    }
    return mappedLocations;
  }
}
