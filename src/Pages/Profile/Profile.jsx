import { useState } from "react";

export default function ProfilePage() {
  const [favorites, setFavorites] = useState([1, 3]);

  const tripPlans = [
    {
      id: 1,
      title: "Egypt Trip",
      location: "Cairo, Giza, Luxor",
      date: "April 20 - April 30, 2026",
      image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Luxor Adventure",
      location: "Luxor, Aswan",
      date: "May 10 - May 15, 2026",
      image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Red Sea Escape",
      location: "Hurghada, Sharm El Sheikh",
      date: "June 5 - June 9, 2026",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "White Desert Safari",
      location: "White Desert",
      date: "July 10 - July 15, 2026",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const favoritePlaces = [
    {
      id: 1,
      title: "Pyramids of Giza",
      location: "Cairo, Egypt",
      image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Hurghada Beach",
      location: "Hurghada, Egypt",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Karnak Temple",
      location: "Luxor, Egypt",
      image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "White Desert",
      location: "Farafra, Egypt",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* تم إزالة مكون Navbar من هنا */}

      <ProfileHero />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Account & Subscription Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AccountInformation />
          <SubscriptionCard />
        </div>

        {/* Trip Plans Section */}
        <SectionHeader title="My Trip Plans" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          {tripPlans.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {/* Favorite Places Section */}
        <SectionHeader title="Favorite Places" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          {favoritePlaces.map((place) => (
            <FavoriteCard
              key={place.id}
              place={place}
              isFavorite={favorites.includes(place.id)}
              onToggleFavorite={() => toggleFavorite(place.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
function ProfileHero() {
  return (
    <div className="relative h-[500px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1800&auto=format&fit=crop"
        alt="cover"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
        <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center text-6xl text-gray-500 shadow-xl border-4 border-white">
          👤
        </div>
        <h2 className="text-6xl font-bold mt-6">Omar Ahmed</h2>
        <p className="text-2xl mt-3 text-white/90">Premium Explorer Member</p>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <StatCard title="Member Since" value="Jan 2024" />
          <StatCard title="Membership" value="Premium" />
          <StatCard title="Status" value="Active" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white text-gray-800 rounded-3xl px-8 py-5 min-w-[220px] shadow-xl">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function AccountInformation() {
  const fields = ["Email", "Phone", "Location", "Password"];
  return (
    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-md">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Account Information</h2>
      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field} className="flex items-center justify-between border rounded-2xl px-5 py-5">
            <div>
              <h3 className="font-semibold text-lg text-gray-700">{field}</h3>
              <p className="text-gray-500 mt-1">Sample {field}</p>
            </div>
            <button className="border border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white transition px-5 py-2 rounded-xl">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscriptionCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md h-fit">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Subscription</h2>
      <div className="bg-[#fff8dc] rounded-3xl p-6 border border-yellow-200">
        <h3 className="text-2xl font-bold text-yellow-700">Premium Plan</h3>
        <p className="text-gray-600 mt-4 leading-relaxed">
          Enjoy unlimited bookings, exclusive discounts, priority support, and early access to premium travel experiences.
        </p>
        <button className="w-full mt-8 bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-2xl font-semibold">
          Manage Plan
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center justify-between mt-14">
      <h2 className="text-4xl font-bold text-gray-800">{title}</h2>
      <button className="text-orange-500 font-semibold hover:underline">View All</button>
    </div>
  );
}

function TripCard({ trip }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition">
      <img src={trip.image} alt={trip.title} className="w-full h-52 object-cover" />
      <div className="p-5">
        <h3 className="text-2xl font-bold text-gray-800">{trip.title}</h3>
        <p className="text-gray-400 text-sm mt-2">{trip.date}</p>
        <p className="text-gray-600 mt-4">📍 {trip.location}</p>
      </div>
    </div>
  );
}
function FavoriteCard({ place, isFavorite, onToggleFavorite }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition">
      <div className="relative">
        <img src={place.image} alt={place.title} className="w-full h-52 object-cover" />
        <button
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-xl transition"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-2xl font-bold text-gray-800">{place.title}</h3>
        <p className="text-gray-600 mt-4">📍 {place.location}</p>
      </div>
    </div>
  );
}