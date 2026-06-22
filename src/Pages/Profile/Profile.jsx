import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/profile-bg.jpg";
import { useAuth } from "../../context/AuthContext";
import countryData from "../../data/country_data";
import { plansService, profileService } from "../../services/api";
import useFavoriteStore from "../../stores/favoriteStore";
import RoutesList from "../../utils/routesList";


export default function ProfilePage() {
  const { user: cachedUser, updateUser } = useAuth();

  // ======================================================
  // USER DATA
  // ======================================================

  const [userData, setUserData] = useState({
    firstName: cachedUser?.firstName || cachedUser?.name?.split("-")[0] || "",
    lastName: cachedUser?.lastName || cachedUser?.name?.split("-").slice(1).join("-") || "",
    email: cachedUser?.email || "",
    password: cachedUser?.password || "",
    profileImage: cachedUser?.profileImage || "",
    isPremium: cachedUser?.isPremium || false,
    memberSince: cachedUser?.memberSince || "",
  });
  const{user}=useAuth();

  // ======================================================
  // OTHER STATES
  // ======================================================

  const [tripPlans, setTripPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(!cachedUser);

  // ======================================================
  // FAVORITES (ZUSTAND)
  // ======================================================

  const favoriteHotels = useFavoriteStore((state) => state.hotels);
  const favoriteRestaurants = useFavoriteStore((state) => state.restaurants);
  const favoritePlaces = useFavoriteStore((state) => state.places);
  const removeHotel = useFavoriteStore((state) => state.removeHotel);
  const removeRestaurant = useFavoriteStore((state) => state.removeRestaurant);
  const removePlace = useFavoriteStore((state) => state.removePlace);

  const totalFavorites =
    favoriteHotels.length + favoriteRestaurants.length + favoritePlaces.length;

  // ======================================================
  // FETCH PROFILE DATA
  // ======================================================



  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return "";
    const opts = { month: "short", day: "numeric" };
    const start = new Date(startDate).toLocaleDateString("en-US", opts);
    if (!endDate) return start;
    const end = new Date(endDate).toLocaleDateString("en-US", opts);
    return `${start} - ${end}`;
  };

  const formatTripForCard = (trip) => {
    const destinationKey = (trip.destination || "").toLowerCase().trim();
    const country = countryData[destinationKey];

    const placesList = Array.isArray(trip.places) ? trip.places : [];
    const counts = placesList.reduce((acc, p) => {
      const category = p.category || "Place";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      id: trip.id,
      title: trip.planName || (country ? `Trip to ${country.title}` : "Trip"),
      image: country?.images?.[0] ? `/${country.images[0]}` : null,
      date: formatDateRange(trip.startDate, trip.endDate),
      location: country?.title || trip.destination || "",
      placesCount: placesList.length,
      categoryCounts: counts,
    };
  };

  // ======================================================
  // USE EFFECT
  // ======================================================

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const trips = await plansService.getUserPlans(user.id);
        console.log(trips)
        setTripPlans(trips || []);
      } catch (error) {
        console.log("PROFILE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const handleSaveProfile = async () => {
    try {
      await profileService.updateUserProfile(userData);
      updateUser(userData);
      setIsEditing(false);
      console.log("PROFILE UPDATED");
    } catch (error) {
      console.log("UPDATE ERROR:", error);
    }
  };

  // ======================================================
  // IMAGE UPLOAD (LOCAL ONLY)
  // ======================================================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Preview only (NO backend upload)
    const imageUrl = URL.createObjectURL(file);

    setUserData((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }));
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-[#0f6d79]">
        Loading Profile...
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <ProfileHero
        userData={userData}
        handleImageUpload={handleImageUpload}
      />

      <main className="max-w-7xl mx-auto px-6 pb-16 relative z-20 -mt-20">
        {/* 📊 Stats Dashboard Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Trips Planned" value={tripPlans.length} icon="✈️" />
          <StatCard title="Favorites" value={totalFavorites} icon="❤️" />
          <StatCard title="Membership Status" value={userData.isPremium ? "Premium" : "Standard"} icon="👑" />
          <StatCard title="Member Since" value={userData.memberSince || "June 2026"} icon="🗓️" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AccountInformation
            userData={userData}
            setUserData={setUserData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveProfile={handleSaveProfile}
          />

          <SubscriptionCard isPremium={userData.isPremium} />
        </div>

        <SectionHeader title="My Trip Plans" />
        {tripPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
            {tripPlans.map((trip) => (
              <TripCard key={trip.id} trip={formatTripForCard(trip)} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 font-medium mt-6 shadow-sm">
            No planned trips yet. Start exploring!
          </div>
        )}

        <SectionHeader title="Favorite Hotels" />
        {favoriteHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
            {favoriteHotels.map((hotel) => (
              <FavoriteCard
                key={`${hotel.country}-${hotel.id}`}
                item={hotel}
                onRemove={() => removeHotel(hotel.country, hotel.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 font-medium mt-6 shadow-sm">
            No favorite hotels saved yet.
          </div>
        )}

        <SectionHeader title="Favorite Restaurants" />
        {favoriteRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
            {favoriteRestaurants.map((restaurant) => (
              <FavoriteCard
                key={`${restaurant.country}-${restaurant.id}`}
                item={restaurant}
                onRemove={() => removeRestaurant(restaurant.country, restaurant.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 font-medium mt-6 shadow-sm">
            No favorite restaurants saved yet.
          </div>
        )}

        <SectionHeader title="Favorite Places" />
        {favoritePlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
            {favoritePlaces.map((place) => (
              <FavoriteCard
                key={`${place.country}-${place.id}`}
                item={place}
                onRemove={() => removePlace(place.country, place.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 font-medium mt-6 shadow-sm">
            No favorite places saved yet.
          </div>
        )}
      </main>
    </div>
  );
}

// ======================================================
// HERO SECTION
// ======================================================

function ProfileHero({ userData, handleImageUpload }) {
  const combinedName = userData.firstName && userData.lastName
    ? `${userData.firstName} ${userData.lastName}`
    : (userData.firstName || "Explorer");

  const getInitials = () => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName[0] || ""}${userData.lastName[0] || ""}`.toUpperCase();
    }
    return "U";
  };

  return (
    <div className="relative h-105 overflow-hidden mt-12">
      <img
        src={bg}
        alt="cover"
        className="w-full h-full object-cover scale-105"
      />

      <div className="absolute inset-0 bg-linear-to-r from-[#1a3c34]/95 via-[#0f172a]/80 to-[#d14b30]/40" />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 z-10 pb-16">
        <div className="relative group">
          {userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-[#d14b30] text-white flex items-center justify-center font-bold text-4xl shadow-2xl border-4 border-white select-none transition duration-300 group-hover:scale-105">
              {getInitials()}
            </div>
          )}

          <label className="absolute bottom-0 right-0 bg-[#d14b30] hover:bg-[#b03d25] transition text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-xl transform translate-x-1 translate-y-1">
            📷
            <input type="file" hidden onChange={handleImageUpload} />
          </label>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight drop-shadow-md">
          {combinedName}
        </h2>

        <p className="text-white/80 text-sm mt-1 font-medium">
          {userData.email}
        </p>

        <div className="mt-4">
          {userData.isPremium ? (
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-1.5 rounded-full font-bold text-xs shadow-lg border border-amber-300">
              👑 Premium Explorer
            </span>
          ) : (
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-semibold text-xs border border-white/20">
              Standard Member
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:-translate-y-0.5 transition duration-300 text-left">
      <div className="w-12 h-12 rounded-xl bg-orange-50 text-2xl flex items-center justify-center text-[#d14b30] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
    </div>
  );
}

// ======================================================
// ACCOUNT INFO
// ======================================================

function AccountInformation({
  userData,
  setUserData,
  isEditing,
  setIsEditing,
  handleSaveProfile,
}) {
  return (
    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-left">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Account Profile
          </h2>
          <p className="text-sm text-gray-400 mt-1">Manage your public credentials and settings</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#d14b30] hover:bg-[#b03d25] transition text-white px-5 py-2.5 rounded-2xl font-semibold shadow-md shadow-orange-500/10 hover:shadow-orange-500/20"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSaveProfile}
            className="bg-[#1a3c34] hover:bg-[#132d27] transition text-white px-5 py-2.5 rounded-2xl font-semibold shadow-md"
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="First Name"
          value={userData.firstName}
          disabled={!isEditing}
          icon="👤"
          onChange={(e) =>
            setUserData({
              ...userData,
              firstName: e.target.value,
            })
          }
        />

        <InputField
          label="Last Name"
          value={userData.lastName}
          disabled={!isEditing}
          icon="👤"
          onChange={(e) =>
            setUserData({
              ...userData,
              lastName: e.target.value,
            })
          }
        />

        <div className="md:col-span-2">
          <InputField
            label="Email Address"
            value={userData.email}
            disabled={!isEditing}
            icon="✉️"
            onChange={(e) =>
              setUserData({
                ...userData,
                email: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// INPUT FIELD
// ======================================================

function InputField({ label, value, disabled, onChange, icon }) {
  return (
    <div>
      <label className="block text-gray-500 text-sm font-semibold mb-2 ml-1 text-left">
        <span className="mr-1">{icon}</span> {label}
      </label>

      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full rounded-2xl px-5 py-3.5 outline-none border transition-all duration-200 text-gray-700 font-medium ${disabled
          ? "bg-gray-50 border-gray-100 cursor-not-allowed"
          : "bg-white border-orange-200 focus:border-[#d14b30] focus:ring-4 focus:ring-orange-500/10"
          }`}
      />
    </div>
  );
}

// ======================================================
// SUBSCRIPTION
// ======================================================

function SubscriptionCard({ isPremium }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between h-full text-left">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Subscription
        </h2>
        <p className="text-sm text-gray-400 mb-6">Your current plan details</p>

        {isPremium ? (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-6 border border-amber-200 relative overflow-hidden text-left shadow-sm">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-amber-400/10 rounded-full blur-xl" />
            <span className="text-2xl">👑</span>
            <h3 className="text-xl font-bold text-amber-800 mt-2">
              Premium Plan
            </h3>
            <p className="text-amber-700/80 text-sm mt-3 leading-relaxed">
              You have active premium membership. Enjoy unlimited trip plans, priority hotel matching, premium guides, and gold status benefits.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left">
            <span className="text-2xl">✈️</span>
            <h3 className="text-xl font-bold text-gray-700 mt-2">
              Free Plan
            </h3>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Unlock AI destination planners, offline travel tools, and premium badges by upgrading to Premium.
            </p>
            <button className="w-full mt-6 bg-[#d14b30] hover:bg-[#b03d25] text-white py-3 rounded-xl font-bold transition shadow-md shadow-orange-500/10 hover:scale-[1.02] duration-200">
              Upgrade Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================
// SECTION HEADER
// ======================================================

function SectionHeader({ title }) {
  return (
    <div className="flex items-center justify-between mt-14 mb-4 text-left">
      <h2 className="text-3xl font-bold text-gray-800">
        {title}
      </h2>
    </div>
  );
}

// ======================================================
// TRIP CARD
// ======================================================

const defaultTripImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80";

function TripCard({ trip }) {
  const categoryLabels = { Hotel: "🏨", Restaurant: "🍽️", "Popular Place": "📍" };
  const breakdown = Object.entries(trip.categoryCounts || {});

  return (
    <Link to={RoutesList.TripPlanned(trip.id)}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 border border-gray-100 flex flex-col text-left">
        <div className="relative overflow-hidden h-48">
          <img
            src={trip.image || defaultTripImage}
            alt={trip.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = defaultTripImage; }}
          />
          <div className="absolute bottom-3 left-3 bg-[#1a3c34]/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
            ✈️ Planned
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
              {trip.title}
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1 font-semibold">
              <span>🗓️</span> {trip.date}
            </p>
          </div>

          <p className="text-gray-600 font-semibold mt-4 text-sm flex items-center gap-1">
            <span className="text-[#d14b30]">📍</span> {trip.location}
          </p>

          {breakdown.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {breakdown.map(([category, count]) => (
                <span
                  key={category}
                  className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full flex items-center gap-1"
                >
                  {categoryLabels[category] || "•"} {count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ======================================================
// FAVORITE CARD
// ======================================================

function FavoriteCard({ item, onRemove }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 border border-gray-100 flex flex-col text-left">
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image ? `/${item.image}` : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        <button
          onClick={onRemove}
          title="Remove from favorites"
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-md w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
        >
          ❤️
        </button>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
          {item.name}
        </h3>

        {item.country && (
          <p className="text-gray-600 font-semibold mt-4 text-sm flex items-center gap-1">
            <span className="text-[#d14b30]">📍</span> {item.country}
          </p>
        )}
      </div>
    </div>
  );
}
