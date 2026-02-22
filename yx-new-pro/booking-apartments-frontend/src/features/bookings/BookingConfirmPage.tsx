import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchBooking, confirmBooking, cancelBooking } from '@/store/bookingsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDisplayDate, calculateNights } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const confirmSchema = z.object({
  paymentRef: z.string().min(1, 'Payment reference is required'),
});

type ConfirmForm = z.infer<typeof confirmSchema>;

export const BookingConfirmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedBooking, loading } = useAppSelector((state) => state.bookings);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
  });

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBooking(id));
    }
  }, [id, dispatch]);

  const onConfirm = async (data: ConfirmForm) => {
    if (!id) return;

    const result = await dispatch(confirmBooking({ id, paymentRef: data.paymentRef }));
    if (confirmBooking.fulfilled.match(result)) {
      toast({
        title: 'Booking Confirmed',
        description: 'Your booking has been successfully confirmed!',
      });
      navigate('/');
    }
  };

  const onCancel = async () => {
    if (!id) return;

    const result = await dispatch(cancelBooking(id));
    if (cancelBooking.fulfilled.match(result)) {
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled.',
      });
      navigate('/');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading booking details...</div>;
  }

  if (!selectedBooking) {
    return <div className="text-center py-8">Booking not found</div>;
  }

  const nights = calculateNights(selectedBooking.startDate, selectedBooking.endDate);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Your Booking</CardTitle>
          <CardDescription>
            Status: <span className="font-semibold">{selectedBooking.status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">{selectedBooking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">{formatDisplayDate(selectedBooking.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">{formatDisplayDate(selectedBooking.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nights:</span>
              <span className="font-medium">{nights}</span>
            </div>
            {selectedBooking.expiresAt && (
              <div className="flex justify-between text-red-600">
                <span>Hold expires at:</span>
                <span className="font-medium">{new Date(selectedBooking.expiresAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          {selectedBooking.status === 'HOLD' && (
            <form onSubmit={handleSubmit(onConfirm)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentRef">Payment Reference</Label>
                <Input
                  id="paymentRef"
                  placeholder="Enter payment reference"
                  {...register('paymentRef')}
                />
                {errors.paymentRef && (
                  <p className="text-sm text-red-500">{errors.paymentRef.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  For demo purposes, enter any reference ID
                </p>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  Confirm Booking
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel Booking
                </Button>
              </div>
            </form>
          )}

          {selectedBooking.status === 'CONFIRMED' && (
            <div className="text-center text-green-600 font-semibold">
              This booking has been confirmed!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
