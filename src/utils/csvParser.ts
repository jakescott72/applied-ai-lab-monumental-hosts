import Papa from 'papaparse';
import { AirbnbListing } from '../types';

export interface ParseResult {
  listings: AirbnbListing[];
  totalParsed: number;
  validCount: number;
  invalidCount: number;
  detectedColumns: string[];
  errors: string[];
}

/**
 * Clean currency string like "$185.00" or " 240,00 " to numeric float
 */
export function cleanPrice(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Clean rating to 5-star scale (handles 0-100 scale or 0-5 scale)
 */
export function cleanRating(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = parseFloat(String(val));
  if (isNaN(num)) return null;
  if (num > 5 && num <= 100) {
    return Math.round((num / 20) * 100) / 100;
  }
  return Math.round(num * 100) / 100;
}

/**
 * Parse CSV file using PapaParse client-side
 */
export function parseAirbnbCsv(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        try {
          const rawRows = results.data as Record<string, any>[];
          const detectedColumns = results.meta.fields || [];
          const listings: AirbnbListing[] = [];
          let invalidCount = 0;

          // Helper to find column key case-insensitively with aliases
          const findKey = (row: Record<string, any>, aliases: string[]): string | undefined => {
            const keys = Object.keys(row);
            for (const alias of aliases) {
              const matched = keys.find(
                (k) => k.trim().toLowerCase() === alias.toLowerCase()
              );
              if (matched && row[matched] !== undefined) return matched;
            }
            return undefined;
          };

          rawRows.forEach((row, idx) => {
            // Find neighborhood
            const neighKey = findKey(row, [
              'neighbourhood_cleansed',
              'neighbourhood',
              'neighborhood',
              'neighborhood_cleansed',
              'neighbourhood_group',
            ]);
            const neighbourhood = (neighKey && row[neighKey] ? String(row[neighKey]).trim() : 'Washington, D.C.');

            // Find room type (Space Type)
            const roomKey = findKey(row, ['room_type', 'roomType', 'room_type_name']);
            const room_type = (roomKey && row[roomKey] ? String(row[roomKey]).trim() : 'Entire home/apt');

            // Find property type (Property Style)
            const propKey = findKey(row, ['property_type', 'propertyType', 'property', 'property_style']);
            let property_type = propKey && row[propKey] ? String(row[propKey]).trim() : '';

            // Find price
            const priceKey = findKey(row, ['price', 'nightly_price', 'rate', 'price_usd']);
            const price = cleanPrice(priceKey ? row[priceKey] : 0);

            if (price <= 0) {
              invalidCount++;
              return; // Skip invalid pricing rows
            }

            // Find bedrooms
            const bedKey = findKey(row, ['bedrooms', 'bedroom', 'beds']);
            let bedrooms = 1;
            if (bedKey && row[bedKey] !== undefined && row[bedKey] !== '') {
              const parsedBed = parseInt(String(row[bedKey]), 10);
              bedrooms = isNaN(parsedBed) ? 1 : Math.max(0, parsedBed);
            }

            // Find bathrooms
            const bathKey = findKey(row, ['bathrooms', 'bathrooms_text', 'baths']);
            let bathrooms = 1;
            if (bathKey && row[bathKey] !== undefined) {
              const parsedBath = parseFloat(String(row[bathKey]).replace(/[^0-9.]/g, ''));
              bathrooms = isNaN(parsedBath) ? 1 : parsedBath;
            }

            // Find accommodates
            const accommKey = findKey(row, ['accommodates', 'guests', 'capacity', 'person_capacity']);
            let accommodates = bedrooms === 0 ? 2 : bedrooms * 2;
            if (accommKey && row[accommKey] !== undefined && row[accommKey] !== '') {
              const parsedAcc = parseInt(String(row[accommKey]), 10);
              if (!isNaN(parsedAcc) && parsedAcc > 0) accommodates = parsedAcc;
            }

            // Find rating
            const ratingKey = findKey(row, ['review_scores_rating', 'review_rating', 'rating', 'scores_rating']);
            const review_scores_rating = ratingKey ? cleanRating(row[ratingKey]) : null;

            // Find review count
            const reviewsKey = findKey(row, ['number_of_reviews', 'reviews_count', 'reviews']);
            let number_of_reviews = 0;
            if (reviewsKey && row[reviewsKey] !== undefined) {
              const parsedRev = parseInt(String(row[reviewsKey]), 10);
              if (!isNaN(parsedRev)) number_of_reviews = parsedRev;
            }

            // Find minimum nights
            const minNightsKey = findKey(row, ['minimum_nights', 'min_nights', 'minimum_stay']);
            let minimum_nights = 1;
            if (minNightsKey && row[minNightsKey] !== undefined) {
              const parsedMin = parseInt(String(row[minNightsKey]), 10);
              if (!isNaN(parsedMin) && parsedMin > 0) minimum_nights = parsedMin;
            }

            // Find annual availability (days available out of 365)
            const availKey = findKey(row, ['availability_365', 'availability', 'avail_365', 'has_availability']);
            let availability_365: number | undefined = undefined;
            if (availKey && row[availKey] !== undefined && row[availKey] !== '') {
              const parsedAvail = parseInt(String(row[availKey]), 10);
              if (!isNaN(parsedAvail)) {
                availability_365 = Math.max(0, Math.min(365, parsedAvail));
              }
            }

            // Listing title/name (strictly sanitize host personal info if present in name)
            const nameKey = findKey(row, ['name', 'listing_name', 'title']);
            const rawName = nameKey && row[nameKey] ? String(row[nameKey]).trim() : `${bedrooms === 0 ? 'Studio' : `${bedrooms}-BR`} in ${neighbourhood}`;
            
            // Clean listing title - scrub patterns like "Hosted by John"
            const sanitizedName = rawName.replace(/hosted by [^,·|-]+/gi, '').trim() || `${neighbourhood} Residence`;

            // ID
            const idKey = findKey(row, ['id', 'listing_id']);
            const id = idKey && row[idKey] ? row[idKey] : `dc-comp-${idx + 1}`;

            // Coordinates if present
            const latKey = findKey(row, ['latitude', 'lat']);
            const lonKey = findKey(row, ['longitude', 'lon', 'lng']);

            // If property_type is empty, infer reasonable D.C. housing style from listing title
            if (!property_type) {
              const lowerName = sanitizedName.toLowerCase();
              if (lowerName.includes('townhouse') || lowerName.includes('rowhouse') || lowerName.includes('rowhome') || lowerName.includes('brownstone')) {
                property_type = 'Entire townhouse';
              } else if (lowerName.includes('condo')) {
                property_type = 'Entire condo';
              } else if (lowerName.includes('suite') || lowerName.includes('guesthouse') || lowerName.includes('in-law') || lowerName.includes('basement')) {
                property_type = 'Entire guest suite';
              } else if (lowerName.includes('manor') || lowerName.includes('home') || lowerName.includes('house')) {
                property_type = 'Entire residential home';
              } else {
                property_type = 'Entire rental unit';
              }
            }

            // Note: Host name, Host ID, Host avatar, Host URL are deliberately omitted here
            listings.push({
              id,
              name: sanitizedName,
              neighbourhood,
              room_type,
              property_type,
              bedrooms,
              bathrooms,
              accommodates,
              price,
              review_scores_rating,
              number_of_reviews,
              minimum_nights,
              availability_365,
              latitude: latKey ? parseFloat(row[latKey]) : undefined,
              longitude: lonKey ? parseFloat(row[lonKey]) : undefined,
            });
          });

          resolve({
            listings,
            totalParsed: rawRows.length,
            validCount: listings.length,
            invalidCount,
            detectedColumns,
            errors: results.errors.map((e) => e.message),
          });
        } catch (err: any) {
          reject(new Error(err?.message || 'Failed to process CSV structure'));
        }
      },
      error: (err) => {
        reject(new Error(`PapaParse error: ${err.message}`));
      },
    });
  });
}
