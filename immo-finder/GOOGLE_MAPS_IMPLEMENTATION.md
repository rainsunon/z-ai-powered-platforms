# Google Maps Location Search Implementation

## Overview

This implementation provides Google Maps location search functionality where the backend handles all Google Maps API calls, and the frontend only calls the backend API to get location suggestions and displays the map using the Google Maps JavaScript API.

## Architecture

```
Frontend (React/Next.js)          Backend (Spring Boot)
     |                                    |
     | 1. User types location             |
     |---------------------------------->|
     |                                    |
     |                                    | 2. Call Google Places API
     |                                    |    (Autocomplete & Place Details)
     |                                    |
     | 3. Return location suggestions      |
     |<----------------------------------|
     |                                    |
     | 4. User selects location            |
     |                                    |
     | 5. Display map with coordinates    |
     |    (Google Maps JavaScript API)     |
```

## Backend Implementation

### LocationSearchService

Located in: [`backend/search-service/src/main/java/com/xrs/immo/application/service/LocationSearchService.java`](backend/search-service/src/main/java/com/xrs/immo/application/service/LocationSearchService.java)

**Features:**
- Search locations using Google Places API autocomplete
- Get place details by place ID
- Reverse geocode coordinates to address
- Filters results to Canada by default

**API Endpoints:**

1. **GET /api/locations/search**
   - Query parameter: `query` (minimum 3 characters)
   - Optional parameter: `language` (defaults to 'en')
   - Returns: List of location suggestions with coordinates

2. **GET /api/locations/places/{placeId}**
   - Path parameter: `placeId`
   - Returns: Detailed place information

3. **GET /api/locations/reverse-geocode**
   - Query parameters: `latitude`, `longitude`
   - Returns: Formatted address

### Configuration

Add to [`backend/search-service/src/main/resources/application.yml`](backend/search-service/src/main/resources/application.yml):

```yaml
google:
  maps:
    api:
      key: ${GOOGLE_MAPS_API_KEY:your-google-maps-api-key-here}
```

### Dependencies

The backend uses:
- `google-maps-services` (version 2.2.0) - For calling Google Maps HTTP API
- `spring-boot-starter-web` - For REST API endpoints
- `jackson-databind` - For JSON parsing

## Frontend Implementation

### LocationSearch Component

Located in: [`frontend/components/LocationSearch.tsx`](frontend/components/LocationSearch.tsx)

**Features:**
- Autocomplete search with debouncing
- Keyboard navigation (arrow keys, enter, escape)
- Loading indicators
- Click outside to close dropdown
- Displays place types and formatted address

**Usage:**

```tsx
<LocationSearch
  onLocationSelect={(location) => {
    console.log('Selected:', location);
    // location contains: address, lat, lng, placeId
  }}
  placeholder="Search for a location..."
  className="max-w-2xl"
/>
```

### GoogleMap Component

Located in: [`frontend/components/GoogleMap.tsx`](frontend/components/GoogleMap.tsx)

**Features:**
- Dynamically loads Google Maps JavaScript API
- Displays markers on the map
- Handles marker click events
- Loading and error states
- Responsive design

**Usage:**

```tsx
<GoogleMap
  center={{ lat: 43.6532, lng: -79.3832 }}
  zoom={14}
  markers={[
    { lat: 43.6532, lng: -79.3832, label: 'Toronto' }
  ]}
  onMarkerClick={(marker) => {
    console.log('Marker clicked:', marker);
  }}
  className="w-full h-96"
/>
```

### Configuration

Add to frontend environment variables (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8083
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

## Data Flow

### Search Flow

1. User types in search input (minimum 3 characters)
2. Frontend calls backend: `GET /api/locations/search?query=toronto&language=en`
3. Backend calls Google Places API autocomplete
4. Backend calls Google Places API place details for each prediction
5. Backend returns list of suggestions with coordinates
6. Frontend displays suggestions in dropdown
7. User selects a location
8. Frontend updates map with selected coordinates

### API Response Format

**LocationSuggestion:**
```json
{
  "placeId": "ChIJdTv7S0NbyIgRoDc50_zRA0",
  "description": "Toronto",
  "address": "ON, Canada",
  "latitude": 43.6532,
  "longitude": -79.3832,
  "formattedAddress": "Toronto, ON, Canada",
  "types": ["locality", "political"]
}
```

**LocationDetail:**
```json
{
  "placeId": "ChIJdTv7S0NbyIgRoDc50_zRA0",
  "address": "Toronto, ON, Canada",
  "latitude": 43.6532,
  "longitude": -79.3832,
  "name": "Toronto",
  "types": ["locality", "political"]
}
```

## Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Places API
   - Maps JavaScript API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key:
   - Application restrictions: HTTP referrers (for frontend) or IP addresses (for backend)
   - API restrictions: Only enable the APIs listed above
6. Add the API key to your environment variables

## Security Considerations

1. **Backend API Key**: The Google Maps API key is stored in backend configuration and never exposed to the frontend
2. **Frontend API Key**: The Google Maps JavaScript API key is used only for displaying the map, not for searching
3. **Rate Limiting**: Google Maps API has rate limits; implement caching if needed
4. **API Key Restrictions**: Always restrict API keys to specific domains/IPs and APIs

## Testing

### Backend Testing

```bash
# Start the search-service
cd backend/search-service
mvn spring-boot:run

# Test the search endpoint
curl "http://localhost:8083/api/locations/search?query=toronto&language=en"
```

### Frontend Testing

```bash
# Start the frontend
cd frontend
npm run dev

# Open browser to http://localhost:3000
# Type in the search box and verify suggestions appear
# Select a location and verify the map updates
```

## Troubleshooting

### Backend Issues

**Error: "API key not valid"**
- Verify `GOOGLE_MAPS_API_KEY` is set in environment variables
- Check that the API key has the correct APIs enabled
- Verify API key restrictions allow requests from your server

**Error: "Quota exceeded"**
- Check your Google Cloud Console for usage
- Consider upgrading your plan or implementing caching

### Frontend Issues

**Error: "Failed to load Google Maps"**
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Check that the Maps JavaScript API is enabled
- Verify API key restrictions allow requests from your domain

**Map not displaying**
- Check browser console for errors
- Verify the map container has a defined height
- Ensure the Google Maps script has loaded before rendering

## Future Enhancements

1. Implement caching for frequently searched locations
2. Add search history for users
3. Support multiple map layers (satellite, terrain)
4. Add custom markers with images
5. Implement place photos
6. Add user's current location detection
7. Support multiple languages for search results
8. Add autocomplete debouncing optimization
9. Implement server-side rendering for better SEO
10. Add unit and integration tests

## References

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript/overview)
- [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview)
