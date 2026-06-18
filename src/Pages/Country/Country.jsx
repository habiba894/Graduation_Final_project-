import { useParams } from "react-router-dom";

import CTASection from "./CTASection";
import HeroSection from "./HeroSection";
import HotelsSection from "./HotelsSection";
import InfoSection from "./InfoSection";
import PopularPlacesSection from "./PopularPlaces";
import RestaurantsSection from "./RestaurantsSection";

const CountryPage = () => {
  const { countryName } = useParams();

  return (
    <div className="w-full overflow-hidden bg-gray-50">
      <HeroSection selectedCountry={countryName} />

      <HotelsSection countryName={countryName} />

      <RestaurantsSection countryName={countryName} />

      <PopularPlacesSection countryName={countryName} />

      <InfoSection countryName={countryName} />

      <CTASection currentCountry={countryName} />
    </div>
  );
};

export default CountryPage;