"use client";

import React, { useState } from "react";
import { HiSearch, HiAdjustments, HiChevronRight, HiStar, HiClock, HiUserGroup, HiLocationMarker } from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Dropdown from "@/src/components/ui/Dropdown";
import Calendar from "@/src/components/ui/Calendar";
import { UZBEKISTAN_REGIONS } from "@/src/lib/regions";
import Link from "next/link";

// Mock Data
const MOCK_RIDES = [
  {
    id: "1",
    driver: { name: "Abbos G.", rating: 4.8, reviewCount: 124, avatar: null },
    from: "Tashkent",
    to: "Samarkand",
    date: "2026-03-20",
    departureTime: "08:30",
    price: 65000,
    availableSeats: 3,
    totalSeats: 4,
    carModel: "Chevrolet Gentra",
    carColor: "Black",
  },
  {
    id: "2",
    driver: { name: "Dilshod M.", rating: 4.9, reviewCount: 89, avatar: null },
    from: "Tashkent",
    to: "Bukhara",
    date: "2026-03-20",
    departureTime: "09:15",
    price: 120000,
    availableSeats: 2,
    totalSeats: 4,
    carModel: "Chevrolet Malibu 2",
    carColor: "White",
  },
  {
    id: "3",
    driver: { name: "Jasur K.", rating: 4.7, reviewCount: 45, avatar: null },
    from: "Tashkent",
    to: "Samarkand",
    date: "2026-03-20",
    departureTime: "11:00",
    price: 55000,
    availableSeats: 4,
    totalSeats: 4,
    carModel: "Chevrolet Cobalt",
    carColor: "Silver",
  },
];

const RidesPage = () => {
  const [activeFrom, setActiveFrom] = useState("tashkent_city");
  const [activeTo, setActiveTo] = useState("samarkand");
  const [activeDate, setActiveDate] = useState("2026-03-20");

  return (
    <div className="bg-light-bg min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="premium-card p-8 mb-10 relative z-30">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
             <div className="grow grid grid-cols-1 md:grid-cols-3 gap-6">
                <Dropdown 
                  label="From"
                  options={UZBEKISTAN_REGIONS.map(r => ({ id: r.id, name: r.name }))}
                  value={activeFrom}
                  onChange={setActiveFrom}
                />
                <Dropdown 
                  label="To"
                  options={UZBEKISTAN_REGIONS.map(r => ({ id: r.id, name: r.name }))}
                  value={activeTo}
                  onChange={setActiveTo}
                />
                <Calendar 
                  label="Date"
                  value={activeDate}
                  onChange={setActiveDate}
                />
             </div>
             <Button className="md:w-36 h-[52px] shadow-lg shadow-primary/20 shrink-0 font-black uppercase tracking-widest text-xs">
               Update
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-8">
             <div className="premium-card p-6">
               <h3 className="font-black text-lg text-dark-text mb-6 flex items-center">
                 <HiAdjustments className="mr-2 text-primary" /> Filters
               </h3>
               
               <div className="space-y-6">
                 <div>
                   <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Departure Time</h4>
                   <div className="space-y-3">
                     <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 border-2 border-border rounded-lg checked:bg-primary transition-all" />
                        <span className="text-dark-text font-medium text-sm">Morning (06:00 - 12:00)</span>
                     </label>
                     <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 border-2 border-border rounded-lg checked:bg-primary transition-all" />
                        <span className="text-dark-text font-medium text-sm">Afternoon (12:00 - 18:00)</span>
                     </label>
                   </div>
                 </div>

                 <div>
                   <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Price Range</h4>
                   <input type="range" className="w-full accent-primary appearance-none bg-gray-200 h-1.5 rounded-full" />
                   <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
                     <span>0 UZS</span>
                     <span>200,000 UZS</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-dark-text">
                {MOCK_RIDES.length} rides available
              </h2>
              <div className="text-sm font-bold text-gray-400">
                Sorted by: <span className="text-primary cursor-pointer hover:underline">Departure time</span>
              </div>
            </div>

            <div className="space-y-6">
              {MOCK_RIDES.map((ride) => (
                <Link href={`/rides/${ride.id}`} key={ride.id} className="block group">
                  <div className="premium-card p-6 md:p-8 hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-12 h-12 bg-light-bg rounded-2xl flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all">
                            <HiLocationMarker className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center text-lg font-black text-dark-text">
                              {ride.from}
                              <HiChevronRight className="mx-2 text-gray-400 group-hover:text-primary transition-colors" />
                              {ride.to}
                            </div>
                            <div className="text-sm font-bold text-gray-400 flex items-center mt-0.5">
                              <HiClock className="mr-1.5 w-4 h-4" /> {formatDate(ride.date)} • {ride.departureTime}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                           <div className="flex items-center">
                             <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden mr-3">
                               {/* Driver Avatar placeholder */}
                               <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                 {ride.driver.name.charAt(0)}
                               </div>
                             </div>
                             <div>
                               <div className="text-sm font-black text-dark-text leading-tight">{ride.driver.name}</div>
                               <div className="flex items-center text-xs font-bold text-accent mt-0.5">
                                 <HiStar className="mr-0.5" /> {ride.driver.rating} ({ride.driver.reviewCount})
                               </div>
                             </div>
                           </div>
                           <div className="text-gray-300">|</div>
                           <div className="text-sm font-bold text-gray-500">
                             {ride.carModel} • {ride.carColor}
                           </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 bg-light-bg md:bg-transparent p-4 md:p-0 rounded-2xl">
                        <div className="text-center md:text-right">
                          <div className="text-2xl font-black text-primary leading-none mb-1">
                            {formatCurrency(ride.price)}
                          </div>
                          <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest justify-center md:justify-end">
                            <HiUserGroup className="mr-1.5 w-4 h-4" /> {ride.availableSeats} seats left
                          </div>
                        </div>
                        <Button variant="primary" size="md" className="group-hover:translate-x-1 transition-transform">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RidesPage;
