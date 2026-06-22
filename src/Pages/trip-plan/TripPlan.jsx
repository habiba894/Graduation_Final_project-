// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import iconlogo from "../../assets/logo.png";
// import plan from "../../assets/plan.jpg";
// import { apiServices, plansService } from "../../services/api";
// import useCountryStore from "../../stores/countryStore";

// // 🖼️ Resolves an image path coming from the API/public folder into a usable URL.
// // - Handles missing/empty values with a fallback
// // - Avoids double leading slashes if the path already has one
// // - Leaves absolute URLs (http/https) untouched

// export default function TripPlanPage() {
//   const { countryName, planId } = useParams();
//   const { countryDetails } = useCountryStore();
//   console.log(countryName)
//   console.log(planId)

//   // 📊 State Management
//   const [tripDays, setTripDays] = useState([
//     { id: 1, title: "Arrival & Relax", date: "May 10, 2026", places: [] },
//     { id: 2, title: "Explore City", date: "May 11, 2026", places: [] },
//     { id: 3, title: "Last Adventure", date: "May 12, 2026", places: [] },
//   ]);
//   const [notes, setNotes] = useState([]);
//   const [newNote, setNewNote] = useState("");
//   const [suggestions, setSuggestions] = useState({
//     hotels: [],
//     restaurants: [],
//     PopularPlaces: [],
//   });

//   // 🔄 API States
//   const [activePlanId, setActivePlanId] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     const fetchCountryDetails = async () => {
//       try {
//         await apiServices.getCountryDetails(countryName).then((res) => setSuggestions({
//           hotels: res.hotels,
//           PopularPlaces: res.places,
//           restaurants: res.restaurants,
//         }));
//       } catch (err) { console.error("Failed to fetch country details:", err); }
//     };
//     const loadSuggestions = async () => {
//       try {
//         setSuggestions({
//           hotels: countryDetails.hotels,
//           PopularPlaces: countryDetails.places,
//           restaurants: countryDetails.restaurants,
//         });
//       } catch (err) {
//         console.error("❌ Failed to load suggestions:", err);
//         // Fallback to empty arrays - UI will handle it gracefully
//         setSuggestions({ restaurants: [], hotels: [], PopularPlaces: [] });
//       }
//     };
//     countryDetails ? loadSuggestions() : fetchCountryDetails();
//   }, [countryDetails, countryName])


//   📋 Load Plan Data if planId or userId exists
//   useEffect(() => {
//     const loadPlanData = async () => {
//       // If we have a planId, load that specific plan
//       if (activePlanId) {
//         try {
//           const response = await plansService.getPlanById(activePlanId);
//           const plan = response.data?.data || response.data;

//           if (plan?.days) {
//             // Transform API data to match component structure
//             const formattedDays = plan.days.map(day => ({
//               id: day.id,
//               title: day.title || `Day ${day.id}`,
//               date: day.date || "",
//               places: (day.places || []).map(place => ({
//                 ...place,
//                 uniqueId: place.id || place.uniqueId || Date.now() + Math.random(),
//                 category: place.type || place.category || "Place",
//                 note: place.note || "",
//               })),
//             }));
//             setTripDays(formattedDays);
//           }

//           if (plan?.notes) {
//             setNotes(plan.notes);
//           }
//         } catch (err) {
//           console.error("❌ Failed to load plan:", err);
//         }
//         return;
//       }

//       // If we have userId but no planId, try to get user's plans
//       if (userId && !activePlanId) {
//         try {
//           const response = await plansService.getUserPlans(userId);
//           const plans = response.data?.data || response.data || [];

//           if (plans.length > 0) {
//             // Use the most recent plan or the one matching countryName
//             const matchingPlan = plans.find(p =>
//               p.country?.toLowerCase() === countryName?.toLowerCase()
//             ) || plans[0];

//             setActivePlanId(matchingPlan.id);
//             // The first useEffect will trigger and load this plan
//             return;
//           }
//         } catch (err) {
//           console.error("❌ Failed to load user plans:", err);
//         }
//       }

//       // No plan found - just hide loading
//     };

//     loadPlanData();

//   }, [activePlanId, userId, countryName]);

//   // ➕ Create new plan if needed
//   const createNewPlan = async () => {
//     try {
//       setIsSaving(true);
//       const response = await plansService.createPlan({
//         userId: "226e46be-d900-49db-b3c1-fab442598a5e",
//         destination: countryName.toLowerCase(),
//         planName: `Trip to ${countryName}`,
//         startDate: "2026-06-25",
//         endDate: "2026-06-28",
//         note: "",
//       });

//       const newPlanId = response.data?.data?.id || response.data?.id;
//       setActivePlanId(newPlanId);
//       return newPlanId;
//     } catch (err) {
//       console.error("❌ Failed to create plan:", err);
//       throw err;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // 📝 Notes Handlers
//   const handleAddNote = async () => {
//     if (newNote.trim() === "") return;

//     const noteToAdd = newNote.trim();

//     // ✅ Optimistic UI Update
//     setNotes(prev => [...prev, noteToAdd]);
//     setNewNote("");

//     // 🌐 Sync with API
//     if (activePlanId) {
//       try {
//         await plansService.updatePlan(activePlanId, { notes: [...notes, noteToAdd] });
//       } catch (err) {
//         console.error("❌ Failed to save note:", err);
//         // 🔙 Rollback on error
//         setNotes(prev => prev.filter(n => n !== noteToAdd));
//         alert("Failed to save note. Please try again.");
//       }
//     } else {
//       // No plan yet - create one first
//       try {
//         const newPlanId = await createNewPlan();
//         await plansService.updatePlan(newPlanId, { notes: [noteToAdd] });
//       } catch (err) {
//         console.error("❌ Failed to create plan for note:", err);
//       }
//     }
//   };

//   const handleRemoveNote = async (index) => {
//     // const noteToRemove = notes[index];

//     // ✅ Optimistic UI Update
//     const newNotes = notes.filter((_, i) => i !== index);
//     setNotes(newNotes);

//     // 🌐 Sync with API
//     if (activePlanId) {
//       try {
//         await plansService.updatePlan(activePlanId, { notes: newNotes });
//       } catch (err) {
//         console.error("❌ Failed to remove note:", err);
//         // 🔙 Rollback
//         setNotes(notes);
//       }
//     }
//   };

//   // 📍 Place Handlers
//   const handleAddToTrip = async (item, activeCategory, dayId) => {
//     const categoryMap = {
//       restaurants: "Restaurant",
//       hotels: "Hotel",
//       PopularPlaces: "Popular Place"
//     };

//     const newPlace = {
//       ...item,
//       image: item.image || item.photo || "",
//       uniqueId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       category: categoryMap[activeCategory] || "Place",
//       dayId,
//       note: "",
//     };

//     // ✅ Optimistic UI Update - Add to local state immediately
//     setTripDays(prevDays => prevDays.map(day =>
//       day.id === dayId
//         ? { ...day, places: [...day.places, newPlace] }
//         : day
//     ));

//     // 🌐 Sync with API
//     try {
//       let currentPlanId = activePlanId;

//       // Create plan if doesn't exist
//       if (!currentPlanId) {
//         currentPlanId = await createNewPlan();
//       }

//       // Prepare place data for API
//       const placePayload = {
//         placeName: item.name,
//         category: newPlace.category,
//         // location: item.location,
//         // image: newPlace.image,
//         // details: item.details,
//         // type: newPlace.category,
//         // dayId: dayId,
//         // note: "",
//         // Add any other fields your backend expects
//       };
//       console.log(placePayload)
//       console.log(currentPlanId)
//       const response = await plansService.addPlaceToPlan(currentPlanId, placePayload);

//       // 🔄 Update the place with real ID from backend
//       const realPlaceId = response.data?.data?.id || response.data?.id;
//       if (realPlaceId) {
//         setTripDays(prevDays => prevDays.map(day =>
//           day.id === dayId
//             ? {
//               ...day,
//               places: day.places.map(p =>
//                 p.uniqueId === newPlace.uniqueId
//                   ? { ...p, uniqueId: realPlaceId, id: realPlaceId }
//                   : p
//               )
//             }
//             : day
//         ));
//       }

//     } catch (err) {
//       console.error("❌ Failed to add place to plan:", err);

//       // 🔙 Rollback: Remove the temp place from UI
//       setTripDays(prevDays => prevDays.map(day =>
//         day.id === dayId
//           ? { ...day, places: day.places.filter(p => p.uniqueId !== newPlace.uniqueId) }
//           : day
//       ));

//       alert("Failed to add to trip. Please check your connection and try again.");
//     }
//   };

//   const handleRemovePlace = async (uniqueId, dayId) => {
//     // ✅ Optimistic UI Update
//     setTripDays(prevDays => prevDays.map(day =>
//       day.id === dayId
//         ? { ...day, places: day.places.filter(p => p.uniqueId !== uniqueId) }
//         : day
//     ));

//     // 🌐 Sync with API - only if it's a real backend ID (not temp_)
//     if (activePlanId && !String(uniqueId).startsWith('temp_')) {
//       try {
//         await plansService.removePlaceFromPlan(activePlanId, uniqueId);
//       } catch (err) {
//         console.error("❌ Failed to remove place:", err);
//         // Optional: Reload plan to ensure sync, or show error message
//       }
//     }
//   };

//   const handleUpdatePlaceNote = async (dayId, uniqueId, updatedText) => {
//     // ✅ Optimistic UI Update
//     setTripDays(prevDays => prevDays.map(day => {
//       if (day.id === dayId) {
//         return {
//           ...day,
//           places: day.places.map(p =>
//             p.uniqueId === uniqueId ? { ...p, note: updatedText } : p
//           ),
//         };
//       }
//       return day;
//     }));

//     // 🌐 Sync with API - only for real backend IDs
//     if (activePlanId && !String(uniqueId).startsWith('temp_')) {
//       try {
//         // Note: Your backend should support PATCH /plans/{id}/places/{placeId}
//         // Or update the whole plan with the modified place
//         await plansService.updatePlan(activePlanId, {
//           // Send updated days array or use a dedicated endpoint
//           // This depends on your backend implementation
//         });
//       } catch (err) {
//         console.error("❌ Failed to update place note:", err);
//         // UI already updated, so we keep it optimistic
//       }
//     }
//   };

//   // 🎯 Computed Values
//   const isTripEmpty = tripDays.every((day) => day.places.length === 0);
//   const suggestionsData = Object.keys(suggestions).length > 0 ? suggestions : {
//     restaurants: [], hotels: [], PopularPlaces: []
//   };

//   // ✅ Main Component Return
//   return (
//     <div className="min-h-screen bg-[#f7f4fa]">
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         <TripBanner countryName={countryName} />

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8 items-stretch">

//           <AddToTripSidebar
//             suggestions={suggestionsData}
//             onAdd={handleAddToTrip}
//             tripDays={tripDays}
//             isLoading={!suggestionsData.restaurants.length && !suggestionsData.hotels.length}
//           />

//           <TripMapCard location={countryName || "Paris"} />

//           {/* 📝 Trip Notes Section */}
//           <div className="bg-white rounded-[30px] shadow-lg p-6 flex flex-col h-full border border-gray-50">
//             <div className="flex items-center justify-between mb-6 px-2">
//               <h2 className="text-3xl font-bold text-gray-700">Trip Notes</h2>
//               {isSaving && <span className="text-xs text-orange-500 font-medium">Saving...</span>}
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar" style={{ maxHeight: "350px" }}>
//               {notes.map((note, index) => (
//                 <div key={index} className="bg-[#f7f4fa] rounded-2xl p-4 text-gray-600 flex justify-between items-start group">
//                   <span className="leading-relaxed">✍️ {note}</span>
//                   <button
//                     onClick={() => handleRemoveNote(index)}
//                     className="text-gray-300 hover:text-orange-500 transition ml-2 opacity-0 group-hover:opacity-100"
//                     aria-label="Remove note"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//               {notes.length === 0 && (
//                 <div className="h-full flex items-center justify-center text-gray-400 italic text-center p-4">
//                   No notes yet. Add your first note below! 📝
//                 </div>
//               )}
//             </div>

//             <div className="mt-auto border-t pt-5">
//               <textarea
//                 value={newNote}
//                 onChange={(e) => setNewNote(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && e.ctrlKey) {
//                     e.preventDefault();
//                     handleAddNote();
//                   }
//                 }}
//                 placeholder="Write something important... (Ctrl+Enter to save)"
//                 className="w-full bg-[#f7f4fa] rounded-2xl px-4 py-3 outline-none border border-transparent focus:border-[#0f6d79] transition resize-none h-24 mb-3"
//               />
//               <button
//                 onClick={handleAddNote}
//                 disabled={!newNote.trim() || isSaving}
//                 className="w-full bg-[#0f6d79] text-white py-3 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSaving ? "Saving..." : "Save Note"}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="mt-12">
//           {isTripEmpty ? (
//             <EmptyTripState iconlogo={iconlogo} countryName={countryName} />
//           ) : (
//             <div className="space-y-12">
//               <h3 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Your Plan</h3>
//               {tripDays
//                 .filter(day => day.places.length > 0)
//                 .map((day) => (
//                   <DaySection
//                     key={day.id}
//                     day={day}
//                     onRemove={handleRemovePlace}
//                     onUpdatePlaceNote={handleUpdatePlaceNote}
//                   />
//                 ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ========================================================= */
// /* ================= ELEMENTS COMPONENTS =================== */
// /* ========================================================= */

// function EmptyTripState({ iconlogo, countryName }) {
//   return (
//     <div className="bg-white rounded-[35px] shadow-lg p-12 text-center min-h-125 flex flex-col items-center justify-center border border-gray-100">
//       <div className="w-48 h-40 rounded-full flex items-center justify-center mb-8">
//         <img loading="lazy" src={iconlogo} alt="Plane Icon" className="w-60 h-40 object-contain" />
//       </div>
//       <h2 className="text-5xl font-bold text-gray-700 mb-6">Start Planning Your Trip</h2>
//       <p className="text-gray-500 text-xl max-w-2xl leading-relaxed mb-10">
//         Your trip plan{countryName ? ` to ${countryName}` : ""} is currently empty.
//         Start adding hotels, restaurants, and popular places from the sidebar to build your personalized travel experience.
//       </p>
//       <div className="flex flex-wrap items-center justify-center gap-4">
//         <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
//           🍽️ Restaurants
//         </div>
//         <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
//           🏨 Hotels
//         </div>
//         <div className="bg-green-50 text-green-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
//           🗺️ Popular Places
//         </div>
//       </div>
//     </div>
//   );
// }

// function TripBanner({ countryName }) {
//   return (
//     <div className="relative rounded-[35px] overflow-hidden shadow-2xl h-105 w-full">
//       <img loading="lazy" src={plan} alt="Travel Banner" className="w-full h-full object-cover" />
//       <div className="absolute inset-0 bg-linear-to-r from-[#0f6d79]/80 via-black/40 to-orange-500/30" />
//       <div className="absolute inset-0 flex flex-col justify-center px-10 z-10 text-white">
//         <div className="max-w-2xl">
//           <span className="bg-orange-500/60 px-5 py-2 rounded-full text-sm font-semibold tracking-wide inline-block mb-6">
//             Smart Travel Planner
//           </span>
//           <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
//             Build Your Dream Trip{countryName && <span className="block text-3xl md:text-4xl mt-2 font-normal opacity-90">to {countryName}</span>}
//           </h1>
//           <p className="text-lg md:text-xl text-white/90 leading-relaxed">
//             Add hotels, restaurants, popular places, and activities to create your personalized travel experience.
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-4 mt-8">
//           <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
//             Hotels
//           </div>
//           <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
//             Restaurants
//           </div>
//           <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
//             Popular Places
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function DaySection({ day, onRemove, onUpdatePlaceNote }) {
//   return (
//     <div className="animate-fade-in">
//       <div className="flex items-start gap-4 mb-6">
//         <div className="w-14 h-14 rounded-full bg-[#0f6d79] text-white flex items-center justify-center font-bold shadow-lg text-lg shrink-0">
//           {day.id}
//         </div>
//         <div>
//           <h2 className="text-4xl font-bold text-gray-800">Day {day.id}: {day.title}</h2>
//           <p className="text-gray-500 text-lg mt-1">{day.date}</p>
//         </div>
//       </div>
//       <div className="space-y-6 ml-6 border-l-2 border-dashed border-gray-300 pl-10">
//         {day.places.map((place) => (
//           <PlaceCard
//             key={place.id}
//             place={place}
//             dayId={day.id}
//             onRemove={onRemove}
//             onUpdatePlaceNote={onUpdatePlaceNote}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function PlaceCard({ place, onRemove, dayId, onUpdatePlaceNote }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [tempNote, setTempNote] = useState(place.note || "");

//   const handleSave = () => {
//     onUpdatePlaceNote(dayId, place.uniqueId, tempNote);
//     setIsEditing(false);
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-md p-5 flex flex-col md:flex-row gap-5 hover:shadow-xl transition border border-gray-50 group">
//       <div className="relative">
//         <img
//           loading="lazy"
//           src={`/${place.image}`}
//           alt={place.name}
//           className="w-full md:w-36 h-36 object-cover rounded-2xl"
//         />
//         <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
//           {place.category}
//         </span>
//       </div>

//       <div className="flex-1 min-w-0">
//         <div className="flex items-start justify-between gap-4">
//           <div className="min-w-0 flex-1">
//             <h3 className="text-2xl font-bold text-gray-800 truncate">{place.name}</h3>
//             <p className="text-gray-500 mt-1 text-sm flex items-center gap-1">
//               📍 {place.location}
//             </p>
//             <p className="text-gray-600 mt-3 text-sm leading-relaxed">{place.details}</p>
//           </div>

//           <button
//             onClick={() => onRemove(place.uniqueId, dayId)}
//             className="text-gray-300 hover:text-red-500 hover:scale-110 transition p-2 rounded-full hover:bg-red-50"
//             aria-label="Remove from trip"
//             title="Remove from trip"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//               <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
//             </svg>
//           </button>
//         </div>

//         {/* 📝 Editable Note Section */}
//         <div className="mt-5">
//           {isEditing ? (
//             <div className="flex flex-col gap-2">
//               <textarea
//                 value={tempNote}
//                 onChange={(e) => setTempNote(e.target.value)}
//                 className="w-full bg-[#f7f4fa] rounded-xl px-4 py-3 text-sm text-gray-600 outline-none border border-orange-300 focus:border-[#0f6d79] transition resize-none h-20"
//                 placeholder="Write your private note here..."
//                 autoFocus
//               />
//               <div className="flex gap-2 justify-end">
//                 <button
//                   onClick={() => { setIsEditing(false); setTempNote(place.note || ""); }}
//                   className="text-gray-400 hover:text-gray-600 text-sm font-semibold px-3 py-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="bg-[#0f6d79] text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-opacity-90 transition"
//                 >
//                   Save Note
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div
//               onClick={() => setIsEditing(true)}
//               className="bg-[#f7f4fa] rounded-2xl px-4 py-3 text-gray-600 text-sm cursor-pointer hover:bg-orange-50 transition border border-transparent hover:border-orange-200 relative group/note"
//             >
//               <span className={place.note ? "" : "italic text-gray-400"}>
//                 {place.note || "✨ Click to add a private note..."}
//               </span>
//               <span className="absolute right-4 top-3 text-[10px] text-orange-400 opacity-0 group-hover/note:opacity-100 font-bold tracking-tighter transition">
//                 EDIT ✍️
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function AddToTripSidebar({ suggestions, onAdd, tripDays, isLoading }) {
//   const [activeCategory, setActiveCategory] = useState("restaurants");
//   const [selectedDay, setSelectedDay] = useState(1);

//   const categoryConfig = {
//     restaurants: { label: "Restaurants", color: "orange", bgColor: "bg-orange-50", activeBg: "bg-orange-600" },
//     hotels: { label: "Hotels", color: "cyan", bgColor: "bg-cyan-50", activeBg: "bg-[#0f6d79]" },
//     PopularPlaces: { label: "Places", color: "green", bgColor: "bg-green-50", activeBg: "bg-green-600" }
//   };

//   const currentItems = suggestions?.[activeCategory] || [];
//   const config = categoryConfig[activeCategory];

//   return (
//     <div className="bg-white rounded-[30px] shadow-lg px-4 py-6 h-full border border-gray-50 flex flex-col">
//       <h2 className="text-3xl font-bold text-orange-600 mb-6">Add to Trip</h2>

//       <select
//         value={selectedDay}
//         onChange={(e) => setSelectedDay(Number(e.target.value))}
//         className="w-full bg-[#f7f4fa] rounded-2xl px-4 py-4 outline-none mb-6 font-semibold text-gray-700 cursor-pointer border border-transparent focus:border-[#0f6d79] transition"
//       >
//         {tripDays.map((day) => (
//           <option key={day.id} value={day.id}>
//             📅 Day {day.id} - {day.title}
//           </option>
//         ))}
//       </select>

//       <div className="flex gap-2 mb-6 flex-wrap">
//         {Object.entries(categoryConfig).map(([key, cfg]) => (
//           <button
//             key={key}
//             onClick={() => setActiveCategory(key)}
//             className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeCategory === key
//               ? `${cfg.activeBg} text-white shadow-md`
//               : `${cfg.bgColor} text-${cfg.color}-600 hover:bg-${cfg.color}-100`
//               }`}
//           >
//             {cfg.label}
//           </button>
//         ))}
//       </div>

//       <div className="flex-1 overflow-hidden flex flex-col">
//         <div className="text-xs text-gray-400 mb-3 font-medium">
//           {currentItems.length} {config.label.toLowerCase()} found
//         </div>

//         <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
//           {isLoading ? (
//             // 🔄 Loading Skeleton
//             [...Array(3)].map((_, i) => (
//               <div key={i} className="bg-[#f9fafb] rounded-3xl p-3 flex items-center gap-4 border border-gray-100 animate-pulse">
//                 <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   <div className="h-6 bg-gray-200 rounded w-20"></div>
//                 </div>
//               </div>
//             ))
//           ) : currentItems.length > 0 ? (
//             currentItems.map((item, index) => {
//               return (
//                 <div
//                   key={index}
//                   className="bg-[#f9fafb] rounded-3xl p-3 flex items-center gap-4 border border-gray-100 hover:border-orange-200 hover:shadow-md transition group"
//                 >
//                   <img
//                     loading="lazy"
//                     src={`/${item.image}`}
//                     alt={item.name}
//                     className="w-16 h-16 object-cover rounded-xl"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
//                     <p className="text-[10px] text-gray-500 truncate mb-2">📍 {item.location}</p>
//                     <button
//                       onClick={() => onAdd(item, activeCategory, selectedDay)}
//                       className="text-orange-600 font-bold text-xs bg-white border border-orange-100 px-3 py-1.5 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition shadow-sm"
//                     >
//                       + Add to Day {selectedDay}
//                     </button>
//                   </div>
//                 </div>
//               )
//             })
//           ) : (
//             <div className="text-center text-gray-400 py-8">
//               <p className="text-2xl mb-2">🔍</p>
//               <p className="text-sm">No {config.label.toLowerCase()} found</p>
//               <p className="text-xs mt-1">Try another category</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function TripMapCard({ location }) {
//   return (
//     <div className="bg-white rounded-[30px] shadow-lg overflow-hidden h-full border border-gray-50 min-h-100 flex flex-col">
//       <div className="p-6 border-b border-gray-50">
//         <h2 className="text-2xl font-bold text-[#0f6d79] flex items-center gap-2">
//           Trip Map
//           {location && <span className="text-sm font-normal text-gray-500">• {location}</span>}
//         </h2>
//       </div>
//       <div className="flex-1 w-full min-h-87.5">
//         <iframe
//           title="Trip Map"
//           className="w-full h-full"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           src={`https://maps.google.com/maps?q=${encodeURIComponent(location || "Paris")}&z=12&output=embed`}
//         />
//       </div>
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import iconlogo from "../../assets/logo.png";
import plan from "../../assets/plan.jpg";
import { useAuth } from "../../context/AuthContext";
import { hotelsList } from "../../data/hotels_data";
import { placesList } from "../../data/places_data";
import { restaurantsList } from "../../data/restaurants_data";
import { apiServices } from "../../services/api";
import useCountryStore from "../../stores/countryStore";
import useTripPlanStore from "../../stores/planStore";
import RoutesList from "../../utils/routesList";

// ======================================================
// PAGE
// ======================================================
// This page now serves two routes that render the exact same UI:
//   /country/:countryName/trip-plan  -> CREATE mode (no plan yet)
//   /plan/:planId                    -> EDIT mode (existing plan)
//
// All plan state (places, notes, saving status) lives in
// useTripPlanStore so both modes share one source of truth and the
// same actions. The only thing that differs between modes is how we
// figure out which country's suggestions to show in the sidebar:
//   - CREATE mode: countryName comes straight from the URL.
//   - EDIT mode: we load the plan first, then use plan.destination.

export default function TripPlanPage() {
  const { countryName: countryFromUrl, planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { countryDetails, setCountryDetails } = useCountryStore();

  const {
    plan: tripPlan,
    isLoading,
    isSaving,
    loadPlanById,
    initDraftPlan,
    updatePlanDetails,
    deletePlan,
    addPlace,
    removePlace,
    updatePlaceNote,
    addNote,
    removeNote,
  } = useTripPlanStore();

  const isEditMode = Boolean(planId);
  const resolvedCountryName = isEditMode ? tripPlan.destination : countryFromUrl;

  const [suggestions, setSuggestions] = useState({
    hotels: [],
    restaurants: [],
    PopularPlaces: [],
  });
  const [newNote, setNewNote] = useState("");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [detailsDraft, setDetailsDraft] = useState({ planName: "", startDate: "", endDate: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  // ------------------------------------------------------
  // LOAD PLAN (edit mode) OR INITIALIZE DRAFT (create mode)
  // ------------------------------------------------------
  useEffect(() => {
    if (isEditMode) {
      loadPlanById(planId);
    } else {
      initDraftPlan(countryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, planId, countryFromUrl]);

  // Keep the inline-edit draft synced once the real plan data arrives
  useEffect(() => {
    setDetailsDraft({
      planName: tripPlan.planName || "",
      startDate: tripPlan.startDate ? tripPlan.startDate.slice(0, 10) : "",
      endDate: tripPlan.endDate ? tripPlan.endDate.slice(0, 10) : "",
    });
  }, [tripPlan.planName, tripPlan.startDate, tripPlan.endDate]);

  // ------------------------------------------------------
  // LOAD SUGGESTIONS for whichever country is active
  // ------------------------------------------------------
  useEffect(() => {
    if (!resolvedCountryName) return;

    const matchesCachedCountry =
      countryDetails &&
      (countryDetails.name || countryDetails.title || "").toLowerCase() ===
      resolvedCountryName.toLowerCase();

    if (matchesCachedCountry) {
      setSuggestions({
        hotels: countryDetails.hotels || [],
        restaurants: countryDetails.restaurants || [],
        PopularPlaces: countryDetails.places || [],
      });
      return;
    }

    const fetchCountryDetails = async () => {
      try {
        const res = await apiServices.getCountryDetails(resolvedCountryName);
        setSuggestions({
          hotels: res.hotels || [],
          restaurants: res.restaurants || [],
          PopularPlaces: res.places || [],
        });
        setCountryDetails(res);
      } catch (err) {
        console.error("❌ Failed to fetch country details:", err);
        setSuggestions({ restaurants: [], hotels: [], PopularPlaces: [] });
      }
    };

    fetchCountryDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedCountryName, countryDetails]);

  // ------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------

  const handleAddToTrip = (item, sourceCategory) => {
    console.log(user?.id)
    addPlace(item, sourceCategory, { userId: user?.id });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(newNote, { userId: user?.id });
    setNewNote("");
  };

  const handleSaveDetails = async () => {
    await updatePlanDetails({
      planName: detailsDraft.planName,
      startDate: detailsDraft.startDate,
      endDate: detailsDraft.endDate,
    });
    setIsEditingDetails(false);
  };

  const handleDeletePlan = async () => {
    if (!tripPlan.id) return;
    if (!window.confirm("Delete this trip plan? This can't be undone.")) return;

    setIsDeleting(true);
    const success = await deletePlan();
    setIsDeleting(false);

    if (success) {
      navigate(RoutesList.Profile);
    }
  };

  // ------------------------------------------------------
  // COMPUTED
  // ------------------------------------------------------

  const placesByCategory = (tripPlan.places || []).reduce((acc, p) => {
    const key = p.category || "Place";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const isTripEmpty = (tripPlan.places || []).length === 0;
  const suggestionsLoading =
    !suggestions.restaurants.length && !suggestions.hotels.length && !suggestions.PopularPlaces.length;

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f4fa] flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading your trip plan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4fa]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <TripBanner
          countryName={resolvedCountryName}
          planName={tripPlan.planName}
          startDate={tripPlan.startDate}
          endDate={tripPlan.endDate}
          isEditMode={isEditMode}
          isEditingDetails={isEditingDetails}
          detailsDraft={detailsDraft}
          setDetailsDraft={setDetailsDraft}
          onStartEdit={() => setIsEditingDetails(true)}
          onCancelEdit={() => setIsEditingDetails(false)}
          onSaveDetails={handleSaveDetails}
          onDeletePlan={handleDeletePlan}
          isSaving={isSaving}
          isDeleting={isDeleting}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8 items-stretch">
          <AddToTripSidebar
            suggestions={suggestions}
            onAdd={handleAddToTrip}
            isLoading={suggestionsLoading}
          />

          <TripMapCard location={resolvedCountryName || "Paris"} />

          {/* 📝 Trip Notes Section */}
          <div className="bg-white rounded-[30px] shadow-lg p-6 flex flex-col h-full border border-gray-50">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-3xl font-bold text-gray-700">Trip Notes</h2>
              {isSaving && <span className="text-xs text-orange-500 font-medium">Saving...</span>}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar" style={{ maxHeight: "350px" }}>
              {(tripPlan.notes || []).map((note, index) => (
                <div key={index} className="bg-[#f7f4fa] rounded-2xl p-4 text-gray-600 flex justify-between items-start group">
                  <span className="leading-relaxed">✍️ {note}</span>
                  <button
                    onClick={() => removeNote(index)}
                    className="text-gray-300 hover:text-orange-500 transition ml-2 opacity-0 group-hover:opacity-100"
                    aria-label="Remove note"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {(!tripPlan.notes || tripPlan.notes.length === 0) && (
                <div className="h-full flex items-center justify-center text-gray-400 italic text-center p-4">
                  No notes yet. Add your first note below! 📝
                </div>
              )}
            </div>

            <div className="mt-auto border-t pt-5">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                placeholder="Write something important... (Ctrl+Enter to save)"
                className="w-full bg-[#f7f4fa] rounded-2xl px-4 py-3 outline-none border border-transparent focus:border-[#0f6d79] transition resize-none h-24 mb-3"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSaving}
                className="w-full bg-[#0f6d79] text-white py-3 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          {isTripEmpty ? (
            <EmptyTripState iconlogo={iconlogo} countryName={resolvedCountryName} />
          ) : (
            <div className="space-y-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Your Plan</h3>
              {Object.entries(placesByCategory).map(([category, places]) => (
                <CategorySection
                  key={category}
                  category={category}
                  places={places}
                  onRemove={removePlace}
                  onUpdatePlaceNote={updatePlaceNote}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* ================= ELEMENTS COMPONENTS =================== */
/* ========================================================= */

function EmptyTripState({ iconlogo, countryName }) {
  return (
    <div className="bg-white rounded-[35px] shadow-lg p-12 text-center min-h-125 flex flex-col items-center justify-center border border-gray-100">
      <div className="w-48 h-40 rounded-full flex items-center justify-center mb-8">
        <img loading="lazy" src={iconlogo} alt="Plane Icon" className="w-60 h-40 object-contain" />
      </div>
      <h2 className="text-5xl font-bold text-gray-700 mb-6">Start Planning Your Trip</h2>
      <p className="text-gray-500 text-xl max-w-2xl leading-relaxed mb-10">
        Your trip plan{countryName ? ` to ${countryName}` : ""} is currently empty.
        Start adding hotels, restaurants, and popular places from the sidebar to build your personalized travel experience.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
          🍽️ Restaurants
        </div>
        <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
          🏨 Hotels
        </div>
        <div className="bg-green-50 text-green-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
          🗺️ Popular Places
        </div>
      </div>
    </div>
  );
}

function TripBanner({
  countryName,
  planName,
  startDate,
  endDate,
  isEditMode,
  isEditingDetails,
  detailsDraft,
  setDetailsDraft,
  onStartEdit,
  onCancelEdit,
  onSaveDetails,
  onDeletePlan,
  isSaving,
  isDeleting,
}) {
  const formattedRange = startDate
    ? `${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${endDate ? ` - ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""
    }`
    : null;

  return (
    <div className="relative rounded-[35px] overflow-hidden shadow-2xl h-105 w-full">
      <img loading="lazy" src={plan} alt="Travel Banner" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0f6d79]/80 via-black/40 to-orange-500/30" />
      <div className="absolute inset-0 flex flex-col justify-center px-10 z-10 text-white">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="bg-orange-500/60 px-5 py-2 rounded-full text-sm font-semibold tracking-wide inline-block">
              Smart Travel Planner
            </span>
            {isEditMode && (
              <>
                <button
                  onClick={onStartEdit}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold transition"
                >
                  ✏️ Edit Details
                </button>
                <button
                  onClick={onDeletePlan}
                  disabled={isDeleting}
                  className="bg-red-500/70 hover:bg-red-500/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold transition disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "🗑️ Delete Plan"}
                </button>
              </>
            )}
          </div>

          {isEditingDetails ? (
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 space-y-3">
              <input
                value={detailsDraft.planName}
                onChange={(e) => setDetailsDraft((d) => ({ ...d, planName: e.target.value }))}
                placeholder="Plan name"
                className="w-full bg-white/90 text-gray-800 rounded-xl px-4 py-2 outline-none font-semibold"
              />
              <div className="flex gap-3">
                <input
                  type="date"
                  value={detailsDraft.startDate}
                  onChange={(e) => setDetailsDraft((d) => ({ ...d, startDate: e.target.value }))}
                  className="flex-1 bg-white/90 text-gray-800 rounded-xl px-4 py-2 outline-none"
                />
                <input
                  type="date"
                  value={detailsDraft.endDate}
                  onChange={(e) => setDetailsDraft((d) => ({ ...d, endDate: e.target.value }))}
                  className="flex-1 bg-white/90 text-gray-800 rounded-xl px-4 py-2 outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={onCancelEdit} className="text-white/80 hover:text-white text-sm font-semibold px-3 py-1.5">
                  Cancel
                </button>
                <button
                  onClick={onSaveDetails}
                  disabled={isSaving}
                  className="bg-white text-[#0f6d79] px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-3">
                {planName || "Build Your Dream Trip"}
                {countryName && (
                  <span className="block text-3xl md:text-4xl mt-2 font-normal opacity-90">to {countryName}</span>
                )}
              </h1>
              {formattedRange && (
                <p className="text-white/80 text-lg font-medium mb-3">🗓️ {formattedRange}</p>
              )}
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Add hotels, restaurants, popular places, and activities to create your personalized travel experience.
              </p>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-8">
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
            Hotels
          </div>
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
            Restaurants
          </div>
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
            Popular Places
          </div>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_ICONS = { Hotel: "🏨", Restaurant: "🍽️", "Popular Place": "📍" };

function CategorySection({ category, places, onRemove, onUpdatePlaceNote }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#0f6d79] text-white flex items-center justify-center font-bold shadow-lg text-2xl shrink-0">
          {CATEGORY_ICONS[category] || "📌"}
        </div>
        <div>
          <h2 className="text-4xl font-bold text-gray-800">{category}s</h2>
          <p className="text-gray-500 text-lg mt-1">{places.length} saved</p>
        </div>
      </div>
      <div className="space-y-6 ml-6 border-l-2 border-dashed border-gray-300 pl-10">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onRemove={onRemove}
            onUpdatePlaceNote={onUpdatePlaceNote}
          />
        ))}
      </div>
    </div>
  );
}

function PlaceCard({ place, onRemove, onUpdatePlaceNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNote, setTempNote] = useState(place.note || "");

  const handleSave = () => {
    onUpdatePlaceNote(place.id, tempNote);
    setIsEditing(false);
  };
  const getPlaceImage = useCallback((category, name) => {
    let place;

    switch (category.trim().split(" ").join("-").toLowerCase()) {
      case "hotel":
        place = hotelsList.find(
          (h) => h.name.toLowerCase() === name.toLowerCase()
        );
        break;

      case "popular-place":
        place = placesList.find(
          (p) => p.name.toLowerCase() === name.toLowerCase()
        );
        break;

      case "restaurant":
        place = restaurantsList.find(
          (r) => r.name.toLowerCase() === name.toLowerCase()
        );
        break;

      default:
        break;
    }

    return place?.image
      ? `/${place.image}`
      : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80";
  }, []);
  return (
    <div className="bg-white rounded-3xl shadow-md p-5 flex flex-col md:flex-row gap-5 hover:shadow-xl transition border border-gray-50 group">
      <div className="relative">
        <img
          loading="lazy"
          src={getPlaceImage(place.category, place.name)}
          alt={place.name}
          className="w-full md:w-36 h-36 object-cover rounded-2xl"
        />
        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
          {place.category}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-bold text-gray-800 truncate">{place.name}</h3>
            {place.location && (
              <p className="text-gray-500 mt-1 text-sm flex items-center gap-1">
                📍 {place.location}
              </p>
            )}
            {place.details && (
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">{place.details}</p>
            )}
          </div>

          <button
            onClick={() => onRemove(place.id)}
            className="text-gray-300 hover:text-red-500 hover:scale-110 transition p-2 rounded-full hover:bg-red-50"
            aria-label="Remove from trip"
            title="Remove from trip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>

        {/* 📝 Editable Note Section */}
        <div className="mt-5">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                className="w-full bg-[#f7f4fa] rounded-xl px-4 py-3 text-sm text-gray-600 outline-none border border-orange-300 focus:border-[#0f6d79] transition resize-none h-20"
                placeholder="Write your private note here..."
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setIsEditing(false); setTempNote(place.note || ""); }}
                  className="text-gray-400 hover:text-gray-600 text-sm font-semibold px-3 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#0f6d79] text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-opacity-90 transition"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="bg-[#f7f4fa] rounded-2xl px-4 py-3 text-gray-600 text-sm cursor-pointer hover:bg-orange-50 transition border border-transparent hover:border-orange-200 relative group/note"
            >
              <span className={place.note ? "" : "italic text-gray-400"}>
                {place.note || "✨ Click to add a private note..."}
              </span>
              <span className="absolute right-4 top-3 text-[10px] text-orange-400 opacity-0 group-hover/note:opacity-100 font-bold tracking-tighter transition">
                EDIT ✍️
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddToTripSidebar({ suggestions, onAdd, isLoading }) {
  const [activeCategory, setActiveCategory] = useState("restaurants");

  const categoryConfig = {
    restaurants: { label: "Restaurants", color: "orange", bgColor: "bg-orange-50", activeBg: "bg-orange-600" },
    hotels: { label: "Hotels", color: "cyan", bgColor: "bg-cyan-50", activeBg: "bg-[#0f6d79]" },
    PopularPlaces: { label: "Places", color: "green", bgColor: "bg-green-50", activeBg: "bg-green-600" }
  };

  const currentItems = suggestions?.[activeCategory] || [];
  const config = categoryConfig[activeCategory];

  return (
    <div className="bg-white rounded-[30px] shadow-lg px-4 py-6 h-full border border-gray-50 flex flex-col">
      <h2 className="text-3xl font-bold text-orange-600 mb-6">Add to Trip</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(categoryConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeCategory === key
              ? `${cfg.activeBg} text-white shadow-md`
              : `${cfg.bgColor} text-${cfg.color}-600 hover:bg-${cfg.color}-100`
              }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="text-xs text-gray-400 mb-3 font-medium">
          {currentItems.length} {config.label.toLowerCase()} found
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
          {isLoading ? (
            // 🔄 Loading Skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#f9fafb] rounded-3xl p-3 flex items-center gap-4 border border-gray-100 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div
                key={item.id ?? index}
                className="bg-[#f9fafb] rounded-3xl p-3 flex items-center gap-4 border border-gray-100 hover:border-orange-200 hover:shadow-md transition group"
              >
                <img
                  loading="lazy"
                  src={`/${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                  <p className="text-[10px] text-gray-500 truncate mb-2">📍 {item.location}</p>
                  <button
                    onClick={() => onAdd(item, activeCategory)}
                    className="text-orange-600 font-bold text-xs bg-white border border-orange-100 px-3 py-1.5 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition shadow-sm"
                  >
                    + Add to Trip
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm">No {config.label.toLowerCase()} found</p>
              <p className="text-xs mt-1">Try another category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TripMapCard({ location }) {
  return (
    <div className="bg-white rounded-[30px] shadow-lg overflow-hidden h-full border border-gray-50 min-h-100 flex flex-col">
      <div className="p-6 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-[#0f6d79] flex items-center gap-2">
          Trip Map
          {location && <span className="text-sm font-normal text-gray-500">• {location}</span>}
        </h2>
      </div>
      <div className="flex-1 w-full min-h-87.5">
        <iframe
          title="Trip Map"
          className="w-full h-full"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${encodeURIComponent(location || "Paris")}&z=12&output=embed`}
        />
      </div>
    </div>
  );
}