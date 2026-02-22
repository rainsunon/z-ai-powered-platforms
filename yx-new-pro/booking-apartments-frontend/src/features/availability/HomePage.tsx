import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { searchAvailability, clearSearchResults } from '@/store/apartmentsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateToISO, formatDisplayDate, calculateNights } from '@/lib/utils';
import { Search, MapPin, Users } from 'lucide-react';

const searchSchema = z.object({
  city: z.string().optional(),
  capacity: z.coerce.number().min(1).optional(),
  from: z.string().min(1, 'Check-in date is required'),
  to: z.string().min(1, 'Check-out date is required'),
}).refine((data) => {
  if (data.from && data.to) {
    return new Date(data.from) < new Date(data.to);
  }
  return true;
}, {
  message: 'Check-out must be after check-in',
  path: ['to'],
});

type SearchForm = z.infer<typeof searchSchema>;

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchResults, loading } = useAppSelector((state) => state.apartments);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      from: formatDateToISO(new Date()),
      to: formatDateToISO(new Date(Date.now() + 86400000)), // tomorrow
    },
  });

  React.useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  const onSubmit = async (data: SearchForm) => {
    setSearchDates({ from: data.from, to: data.to });
    await dispatch(searchAvailability(data));
  };

  const [searchDates, setSearchDates] = React.useState({ from: '', to: '' });

  const handleApartmentClick = (apartmentId: string) => {
    navigate(`/apartments/${apartmentId}?from=${searchDates.from}&to=${searchDates.to}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Find Your Perfect Apartment</h1>
        <p className="text-lg text-gray-600">Search available apartments for your next stay</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Availability</CardTitle>
          <CardDescription>Enter your preferences to find available apartments</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g., Gdansk"
                  {...register('city')}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="Number of guests"
                  {...register('capacity')}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500">{errors.capacity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="from">Check-in</Label>
                <Input
                  id="from"
                  type="date"
                  {...register('from')}
                />
                {errors.from && (
                  <p className="text-sm text-red-500">{errors.from.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="to">Check-out</Label>
                <Input
                  id="to"
                  type="date"
                  {...register('to')}
                />
                {errors.to && (
                  <p className="text-sm text-red-500">{errors.to.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searchResults && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {searchResults.totalElements} Available Apartment{searchResults.totalElements !== 1 ? 's' : ''}
          </h2>

          {searchResults.items.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No apartments found matching your criteria. Try adjusting your search.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.items.map((apartment) => (
                <Card 
                  key={apartment.id} 
                  className="cursor-pointer hover:shadow-lg transi
                  onClick={() => handleApartmentClick(apartment.id, searchResults!.query?.from || '', searchResults!.query?.to || '')}
                >
                  <CardHeader>
                    <CardTitle>{apartment.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {apartment.city}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {apartment.capacity} guests
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
