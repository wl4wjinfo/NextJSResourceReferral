declare namespace google.maps.places {
  interface PlaceResult {
    name?: string;
    formatted_address?: string;
    formatted_phone_number?: string;
    opening_hours?: {
      weekday_text?: string[];
      isOpen?: () => boolean;
    };
    geometry?: {
      location: google.maps.LatLng;
    };
    place_id?: string;
  }

  enum PlacesServiceStatus {
    OK,
    ZERO_RESULTS,
    OVER_QUERY_LIMIT,
    REQUEST_DENIED,
    INVALID_REQUEST,
  }

  class PlacesService {
    constructor(attrContainer: HTMLDivElement | google.maps.Map);
    nearbySearch(
      request: {
        location: google.maps.LatLng;
        radius: number;
        keyword?: string;
        type?: string;
      },
      callback: (
        results: PlaceResult[] | null,
        status: PlacesServiceStatus
      ) => void
    ): void;
    
    getDetails(
      request: {
        placeId: string;
        fields: string[];
      },
      callback: (
        result: PlaceResult | null,
        status: PlacesServiceStatus
      ) => void
    ): void;
  }
}
