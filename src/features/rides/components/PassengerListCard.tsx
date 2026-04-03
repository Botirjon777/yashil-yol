"use client";

import { HiUserGroup, HiPhone } from "react-icons/hi";

interface PassengerListCardProps {
  trip: any;
  rd: (key: string) => string;
  isDriver?: boolean;
}

export const PassengerListCard = ({
  trip,
  rd,
  isDriver = false,
}: PassengerListCardProps) => {
  return (
    <div className="premium-card p-8">
      <h3 className="text-xl font-black text-dark-text mb-8 flex items-center">
        <HiUserGroup className="mr-2 text-primary w-6 h-6" />{" "}
        {rd("passengerList")}
      </h3>
      {trip.bookings && trip.bookings.length > 0 ? (
        <div className="space-y-4">
          {trip.bookings
            .flatMap((booking: any) =>
              (booking.passengers || []).map((p: any) => ({
                ...p,
                bookingId: booking.id,
              })),
            )
            .map((passenger: any, index: number) => (
              <div
                key={`${passenger.bookingId}-${index}`}
                className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border group hover:border-primary transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black border border-border">
                    {passenger.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <div className="font-black text-dark-text">
                      {passenger.name}
                    </div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {passenger.phone}
                    </div>
                  </div>
                </div>
                {isDriver && passenger.phone && (
                  <a
                    href={`tel:${passenger.phone}`}
                    className="p-3 bg-white text-primary rounded-xl border border-border hover:bg-primary hover:text-white transition-all shadow-xs"
                  >
                    <HiPhone className="w-5 h-5" />
                  </a>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-light-bg rounded-3xl border border-dashed border-border">
          <HiUserGroup className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">{rd("noBookings")}</p>
        </div>
      )}
    </div>
  );
};
