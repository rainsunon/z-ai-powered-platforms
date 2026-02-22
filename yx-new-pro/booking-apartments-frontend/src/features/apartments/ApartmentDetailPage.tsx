import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchApartment, checkAvailability } from '@/store/apartmentsSlice';
import { createBookingHold } from '@/store/bookingsSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDisplayDate, calculateNights } from '@/lib/utils';
import { MapPin, Users, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const ApartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedApartment, availability, loading } = useAppSelector((state) => state.apartments);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { loading: bookingLoading } = useAppSelector((state) => state.bookings);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  React.useEffect(() => {
    if (id) {
      dispatch(fetchApartment(id));
      if (from && to) {
        dispatch(checkAvailability({ id, from, to }));
      }
    }
  }, [id, from, to, dispatch]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please login to book an apartment.',
      });
      navigate('/login');
      return;
    }

    if (!id || !from || !to) {
      toast({
        variant: 'destructive',
        title: 'Invalid Booking',
        description: 'Please select dates from the search page.',
      });
      return;
    }

    const result = await dispatch(createBookingHold({
      apartmentId: id,
      startDate: from,
      endDate: to,
    }));

    if (createBookingHold.fulfilled.match(result)) {
      toast({
        title: 'Booking Hold Created',
        description: 'Your booking has been placed on hold.',
      });
      navigate(`/bookings/${result.payload.id}/confirm`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: result.payload as string,
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading apartment details...</div>;
  }

  if (!selectedApartment) {
    return <div className="text-center py-8">Apartment not found</div>;
  }

  const isAvailable = availability[id!]?.available ?? true;
  const nights = from && to ? calculateNights(from, to) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{selectedApartment.name}</CardTitle>
          <CardDescription className="flex items-center space-x-4 text-lg">
            <span className="flex items-center">
              <MapPin className="h-5 w-5 mr-1" />
              {selectedApartment.city}
            </span>
            <span className="flex items-center">
              <Users className="h-5 w-5 mr-1" />
              Up to {selectedApartment.capacity} guests
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
            Apartment Image Placeholder
          </div>

          {from && to && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{formatDisplayDate(from)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{formatDisplayDate(to)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={!isAvailable || bookingLoading || !from || !to}
            onClick={handleBook}
          >
            {bookingLoading ? 'Creating Booking...' : 'Book Now'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
