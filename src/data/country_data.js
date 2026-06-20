const countryData = {
    egypt: {
        title: "Egypt",
        subtitle: "Where ancient wonders meet modern magic",
        overlay: "from-amber-900/80 via-orange-900/60 to-transparent",
        temperature: "24°C",
        weather: "Sunny",
        city: "Cairo",
        currency: "EGP",
        highlights: ["Pyramids", "Nile Cruise", "Red Sea"],
        details: {
            code: "EG",
            language: "Arabic",
            timezone: "UTC+02:00",
            population: "114,535,772",
            subregion: "Northern Africa",
            currency: "Egyptian Pound (EGP)",
        },
        images: [
            "country/egypt/landmarks/landmark-1.jpg",
            "country/egypt/landmarks/landmark-2.jpg",
            "country/egypt/landmarks/landmark-3.jpg",
        ],
        places: [
            {
                id: 1, name: "Pyramids of Giza", image: "country/egypt/places/place-1.jpg",
                link: "https://en.wikipedia.org/wiki/Giza_pyramid_complex",
            },
            {
                id: 1, name: "Grand Egyptian Museum", image: "country/egypt/places/place-2.jpg",
                link: "https://en.wikipedia.org/wiki/Luxor_Temple",
            },
            {
                id: 1, name: "Abu Simbel Temples", image: "country/egypt/places/place-3.jpg",
                link: "https://en.wikipedia.org/wiki/Abu_Simbel",
            },
        ],
        hotels: [
            {
                id: 1, rating: 4.8, price: "$250/night",
                link: "https://www.fourseasons.com/cairo",
                name: "Four Seasons Hotel Cairo", image: "country/egypt/hotels/hotel-1.jpg",
            },
            {
                id: 2, rating: 4.9, price: "$320/night",
                name: "The Nile Ritz-Carlton", image: "country/egypt/hotels/hotel-2.jpg",
                link: "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/overview/",
            },
            {
                id: 3, rating: 4.9, price: "$400/night",
                name: "Marriott Mena House", image: "country/egypt/hotels/hotel-3.jpg",
                link: "https://www.marriott.com/en-us/hotels/caimn-marriott-mena-house-cairo/overview/",
            },
        ],
        restaurants: [
            {
                id: 1, stars: 4, name: "Khan el-Khalili Restaurant", image: "country/egypt/restaurants/restaurant-1.jpg",
                location: "Khan el-Khalili, Cairo", kindOfFood: "Traditional Egyptian",
                instagram: "https://www.instagram.com/khanelkhalilirestaurant?igsh=MTZka2xmNGRiOWJ2dw==",
            },
            {
                id: 2, stars: 4, name: "Abou Tarek", image: "country/egypt/restaurants/restaurant-2.jpg",
                location: "Downtown, Cairo", kindOfFood: "Koshary & Egyptian Street Food",
                instagram: "https://www.instagram.com/koshariaboutarek?igsh=MXY3dXY3YXdjNnVvag==",
            },
            {
                id: 3, stars: 5, name: "Sequoia Restaurant", image: "country/egypt/restaurants/restaurant-3.jpg",
                location: "Zamalek, Cairo", kindOfFood: "Mediterranean & Egyptian Fusion",
                instagram: "https://www.instagram.com/sequoiaonline?igsh=MWRqdTgwMDdrcG45Mw==",
            },
        ],
    },
    france: {
        title: "France",
        subtitle: "Romance, art, and timeless elegance await",
        overlay: "from-indigo-900/80 via-purple-900/60 to-transparent",
        temperature: "18°C",
        weather: "Partly Cloudy",
        city: "Paris",
        currency: "EUR",
        highlights: ["Eiffel Tower", "Louvre", "French Riviera"],
        details: {
            code: "FR",
            language: "French",
            timezone: "UTC+01:00",
            currency: "Euro (EUR)",
            population: "68,400,000",
            subregion: "Western Europe"
        },
        images: [
            "country/france/landmarks/landmark-1.jpg",
            "country/france/landmarks/landmark-2.jpg",
            "country/france/landmarks/landmark-3.jpg"
        ],
        places: [
            {
                id: 1, name: "Eiffel Tower", image: "country/france/places/place-1.jpg",
                link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
            },
            {
                id: 1, name: "Louvre Museum", image: "country/france/places/place-2.jpg",
                link: "https://en.wikipedia.org/wiki/Louvre",
            },
            {
                id: 1, name: "Notre-Dame Cathedral", image: "country/france/places/place-3.jpg",
                link: "https://en.wikipedia.org/wiki/Notre-Dame_de_Paris",
            },
        ],
        hotels: [
            {
                id: 1, rating: 4.8, price: "$850/night",
                link: "https://www.fourseasons.com/paris",
                name: "Four Seasons Hotel George V Paris", image: "country/france/hotels/hotel-1.jpg",
            },
            {
                id: 2, rating: 4.9, price: "$320/night",
                name: "Le Meurice", image: "country/france/hotels/hotel-2.jpg",
                link: "https://www.dorchestercollection.com/paris/le-meurice",
            },
            {
                id: 3, rating: 4.9, price: "$750/night",
                name: "Hotel Plaza Athénée", image: "country/france/hotels/hotel-3.jpg",
                link: "https://www.dorchestercollection.com/paris/hotel-plaza-athenee/dining",
            },
        ],
        restaurants: [
            {
                id: 1, stars: 5, name: "Le Bernardin", image: "country/france/restaurants/restaurant-1.jpg",
                location: "Paris, France", kindOfFood: "French Fine Dining",
                instagram: "https://www.le-bernardin.com/home",
            },
            {
                id: 2, stars: 4, name: "L'Ami Jean", image: "country/france/restaurants/restaurant-2.jpg",
                location: "Paris, France", kindOfFood: "Traditional French Bistro",
                instagram: "https://www.instagram.com/l_ami_jean?igsh=MTBpZHlqZWYydmN0Yg==",
            },
            {
                id: 3, stars: 4, name: "Le Comptoir du Relais", image: "country/france/restaurants/restaurant-3.jpg",
                location: "Paris, France", kindOfFood: "French Bistro Cuisine",
                instagram: "https://www.instagram.com/comptoir_durelais?igsh=aXhybmdmcmVrcG9t",
            },

        ],
    },
    turkey: {
        title: "Turkey",
        subtitle: "A breathtaking bridge between continents",
        overlay: "from-rose-900/80 via-pink-900/60 to-transparent",
        temperature: "22°C",
        weather: "Clear Sky",
        city: "Istanbul",
        currency: "TRY",
        highlights: ["Bosphorus", "Cappadocia", "Grand Bazaar"],
        details: {
            code: "TR",
            language: "Turkish",
            timezone: "UTC+03:00",
            population: "85,700,000",
            subregion: "Western Asia",
            currency: "Turkish Lira (TRY)",
        },
        images: [
            "country/turkey/landmarks/landmark-1.jpg",
            "country/turkey/landmarks/landmark-2.jpg",
            "country/turkey/landmarks/landmark-3.jpg"
        ],
        places: [
            {
                id: 1, name: "Hagia Sophia", image: "country/turkey/places/place-1.jpg",
                link: "https://en.wikipedia.org/wiki/Hagia_Sophia",
            },
            {
                id: 1, name: "Cappadocia", image: "country/turkey/places/place-2.jpg",
                link: "https://en.wikipedia.org/wiki/Cappadocia",
            },
            {
                id: 1, name: "Pamukkale", image: "country/turkey/places/place-3.jpg",
                link: "https://en.wikipedia.org/wiki/Pamukkale",
            },
        ],
        hotels: [
            {
                id: 1, rating: 4.8, price: "$450/night",
                link: "https://www.fourseasons.com/bosphorus",
                name: "Four Seasons Hotel Istanbul", image: "country/turkey/hotels/hotel-1.jpg",
            },
            {
                id: 2, rating: 4.9, price: "$300/night",
                name: "Çırağan Palace Kempinski", image: "country/turkey/hotels/hotel-2.jpg",
                link: "https://www.kempinski.com/en/ciragan-palace",
            },
            {
                id: 3, rating: 4.9, price: "$380/night",
                name: "Swissôtel The Bosphorus", image: "country/turkey/hotels/hotel-3.jpg",
                link: "https://www.swissotel.com/hotels/istanbul",
            },
        ],
        restaurants: [
            {
                id: 1, stars: 4, name: "Ciğerci Arif", image: "country/turkey/restaurants/restaurant-1.jpg",
                kindOfFood: "Traditional Turkish Kebab", location: "Istanbul, Turkey",
                instagram: "https://www.instagram.com/cigerciarifozluce62?igsh=aWV6YXN0bjYxczFv",
            },
            {
                id: 2, stars: 4, name: "Hamdi Restaurant", image: "country/turkey/restaurants/restaurant-2.jpg",
                kindOfFood: "Ottoman & Turkish Cuisine", location: "Istanbul, Turkey",
                instagram: "https://www.instagram.com/hamdirestaurants?igsh=cjQwaWt1eWtuMG4w",
            },
            {
                id: 3, stars: 5, name: "Mikla Restaurant", image: "country/turkey/restaurants/restaurant-3.jpg",
                kindOfFood: "Modern Turkish with Scandinavian Touch", location: "Istanbul, Turkey",
                instagram: "https://www.instagram.com/miklarestaurant?igsh=MTFyMWJrZmQ0bTZiNg==",
            },
        ],
    },
};

export default countryData;
