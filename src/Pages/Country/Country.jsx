import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiServices } from "../../services/api";
import useCountryStore from "../../stores/countryStore";
import CTASection from "./CTASection";
import HeroSection from "./HeroSection";
import HotelsSection from "./HotelsSection";
import InfoSection from "./InfoSection";
import PopularPlacesSection from "./PopularPlaces";
import RestaurantsSection from "./RestaurantsSection";

const CountryPage = () => {
  const { countryName } = useParams();
  const [_, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryHotels, setCountryHotels] = useState([]);
  const [countryPlaces, setCountryPlaces] = useState([]);
  const [countryLandmarks, setCountryLandmarks] = useState([]);
  const [countryDetails, setCountryDetails] = useState([]);
  const [countryRestaurants, setCountryRestaurants] = useState([]);

  const { setCountryDetails: storeCountryDetails } = useCountryStore();
  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await apiServices.getCountryDetails(countryName);
        console.log(details)
        setCountryHotels([...details.hotels]);
        setCountryPlaces([...details.places]);
        setCountryLandmarks([...details.images]);
        setCountryRestaurants([...details.restaurants]);
        setCountryDetails({
          title: details.title,
          subtitle: details.subtitle,
          overlay: details.overlay,
          temperature: details.temperature,
          weather: details.weather,
          capital: details.city,
          currency: details.currency,
          highlights: details.highlights,
          slug: details.slug,
        });
      } catch (err) {
        console.error("Failed to fetch country details:", err);
        setError(`Failed to load country details. Please try again later.: ${err.message}`);
      }
      finally { setLoading(false); }
    };
    fetchCountryDetails();
  }, [countryName]);

  return (
    <div className="w-full overflow-hidden bg-gray-50">
      <HeroSection
        onStartPlanning={() => storeCountryDetails({
          hotels: countryHotels,
          places: countryPlaces,
          images: countryLandmarks,
          restaurants: countryRestaurants,
          details: { ...countryDetails },
        })}
        details={countryDetails}
        landmarks={countryLandmarks}
        countryName={countryName}
        loading={loading} />

      <HotelsSection hotels={countryHotels} countryName={countryName} loading={loading} />

      <RestaurantsSection restaurants={countryRestaurants} countryName={countryName} loading={loading} />

      <PopularPlacesSection places={countryPlaces} countryName={countryName} loading={loading} />

      <InfoSection countryName={countryName} />

      <CTASection currentCountry={countryName} />
    </div>
  );
};

export default CountryPage;