export interface AirbnbListing {
  id: string | number;
  name: string;
  neighbourhood: string;
  room_type: string;
  property_type?: string;
  bedrooms: number;
  bathrooms?: number;
  accommodates: number;
  price: number;
  review_scores_rating: number | null;
  number_of_reviews: number;
  minimum_nights: number;
  availability_365?: number;
  latitude?: number;
  longitude?: number;
}

export interface PricingSummaryStats {
  median: number;
  p25: number;
  p75: number;
  iqr: number;
  sampleSize: number;
  mean: number;
  min: number;
  max: number;
  rawValues: number[];
  formulaDetails: {
    medianFormula: string;
    p25Formula: string;
    p75Formula: string;
    sampleSizeFormula: string;
  };
}

export interface PropertyFilters {
  neighborhood: string;
  spaceType: string;
  propertyStyle: string;
  bedrooms: string;
  minAccommodates?: number;
  searchQuery?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'reviews_desc';
}

export interface AnnualRevenueEstimate {
  estimatedBookedNights: number;
  rawMedianBookedNights: number;
  isCapped: boolean;
  occupancyRatePercent: number;
  medianNightlyPrice: number;
  grossAnnualRevenue: number;
  managementFeePercent: number;
  managementFeeAmount: number;
  netOwnerTakeHome: number;
  activeListingCount: number;
  formulaDetails: {
    bookedNightsFormula: string;
    grossRevenueFormula: string;
    managementFeeFormula: string;
    netTakeHomeFormula: string;
  };
}

export interface StayLengthBenchmarkStats {
  medianMinimumNights: number;
  dominantBucket: 'short' | 'medium' | 'extended';
  dominantBucketLabel: string;
  dominantBucketPercentage: number;
  sampleSize: number;
  buckets: {
    short: { count: number; percentage: number; rangeLabel: string };
    medium: { count: number; percentage: number; rangeLabel: string };
    extended: { count: number; percentage: number; rangeLabel: string };
  };
  recommendedRule: string;
  practicalTakeaway: string;
  formulaFootnote: string;
}

export interface DatasetMeta {
  fileName: string;
  rowCount: number;
  loadedAt: string;
  isSample: boolean;
}

