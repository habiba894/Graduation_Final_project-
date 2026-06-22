import { create } from "zustand";
import { plansService } from "../services/api";

// ======================================================
// HELPERS
// ======================================================

const CATEGORY_MAP = {
    restaurants: "Restaurant",
    hotels: "Hotel",
    PopularPlaces: "Popular Place",
};

// Normalizes a place coming from the backend (flat places[] with
// { id, placeName, category, ... }) into the shape the UI renders.
// Falls back gracefully if some fields (image/location/details) are
// missing, since the backend's place record is thinner than the
// catalog data shown in the "Add to Trip" sidebar.
const normalizePlace = (place) => ({
    id: place.id,
    placeId: place.placeId || place.id,
    name: place.placeName || place.name || "Untitled place",
    category: place.category || "Place",
    image: place.image || "",
    location: place.location || "",
    details: place.details || "",
    note: place.note || "",
    createdAt: place.createdAt || null,
});

const emptyPlan = () => ({
    id: null,
    destination: "",
    planName: "",
    startDate: "",
    endDate: "",
    note: "",
    places: [],
});

// ======================================================
// STORE
// ======================================================

const useTripPlanStore = create((set, get) => ({
    // ---- Plan data ----
    plan: emptyPlan(),

    // ---- UI/async state ----
    isLoading: false,
    isSaving: false,
    error: null,

    // ======================================================
    // LOAD
    // ======================================================

    // Loads an existing plan by id (edit mode: /plan/:planId)
    loadPlanById: async (planId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await plansService.getPlanById(planId);
            const plan = data?.data || data;

            set({
                plan: {
                    id: plan.id,
                    destination: (plan.destination || "").toLowerCase().trim(),
                    planName: plan.planName || "",
                    startDate: plan.startDate || "",
                    endDate: plan.endDate || "",
                    note: plan.note || "",
                    places: (plan.places || []).map(normalizePlace),
                },
                isLoading: false,
            });

            return plan;
        } catch (err) {
            console.error("❌ Failed to load plan:", err);
            set({ error: "Failed to load plan", isLoading: false });
            return null;
        }
    },

    // Sets up a brand-new, not-yet-created plan for a country
    // (creation mode: /country/:countryName/trip-plan). Nothing is
    // sent to the backend until the user actually adds a place or note.
    initDraftPlan: (countryName) => {
        set({
            plan: {
                ...emptyPlan(),
                destination: (countryName || "").toLowerCase().trim(),
                planName: countryName ? `Trip to ${countryName}` : "",
            },
            isLoading: false,
            error: null,
        });
    },

    reset: () => set({ plan: emptyPlan(), isLoading: false, isSaving: false, error: null }),

    // ======================================================
    // PLAN-LEVEL ACTIONS (create / update / delete)
    // ======================================================

    // Creates the plan on the backend the first time it's needed
    // (first place added or first note saved while id is still null).
    ensurePlanExists: async (defaults = {}) => {
        const { plan } = get();
        if (plan.id) return plan.id;

        set({ isSaving: true });
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const endDate = new Date(tomorrow);
            endDate.setDate(endDate.getDate() + 3);

            const payload = {
                userId: defaults.userId,
                destination: plan.destination,
                planName: plan.planName || `Trip to ${plan.destination}`,
                startDate:
                    plan.startDate ||
                    defaults.startDate ||
                    tomorrow.toISOString().slice(0, 10),
                endDate:
                    plan.endDate ||
                    defaults.endDate ||
                    endDate.toISOString().slice(0, 10),
                note: plan.note || "",
            };

            const data = await plansService.createPlan(payload);
            const created = data?.data || data;
            const newId = created?.id;

            set((state) => ({
                plan: { ...state.plan, id: newId },
                isSaving: false,
            }));

            return newId;
        } catch (err) {
            console.error("❌ Failed to create plan:", err);
            set({ isSaving: false, error: "Failed to create plan" });
            throw err;
        }
    },

    // Updates plan-level fields (title, dates, note) both locally and on the backend.
    updatePlanDetails: async (updates) => {
        const { plan } = get();
        const previous = { ...plan };

        set((state) => ({ plan: { ...state.plan, ...updates } }));

        if (!plan.id) return; // not created yet, nothing to sync

        set({ isSaving: true });
        try {
            await plansService.updatePlan(plan.id, updates);
            set({ isSaving: false });
        } catch (err) {
            console.error("❌ Failed to update plan:", err);
            set({ plan: previous, isSaving: false, error: "Failed to save changes" });
        }
    },

    // Deletes the whole plan. Returns true on success so the page can navigate away.
    deletePlan: async () => {
        const { plan } = get();
        if (!plan.id) return true;

        set({ isSaving: true });
        try {
            await plansService.deletePlan(plan.id);
            set({ isSaving: false });
            get().reset();
            return true;
        } catch (err) {
            console.error("❌ Failed to delete plan:", err);
            set({ isSaving: false, error: "Failed to delete plan" });
            return false;
        }
    },

    // ======================================================
    // PLACE ACTIONS
    // ======================================================

    // item: raw suggestion object from the sidebar (hotel/restaurant/place catalog entry)
    // sourceCategory: "restaurants" | "hotels" | "PopularPlaces"
    addPlace: async (item, sourceCategory, options = {}) => {
        const category = CATEGORY_MAP[sourceCategory] || "Place";
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        const optimisticPlace = normalizePlace({
            id: tempId,
            placeName: item.name,
            category,
            image: item.image || item.photo || "",
            location: item.location || "",
            details: item.details || "",
        });

        set((state) => ({
            plan: { ...state.plan, places: [...state.plan.places, optimisticPlace] },
        }));

        try {
            const planId = await get().ensurePlanExists(options);

            const data = await plansService.addPlaceToPlan(planId, {
                placeName: item.name,
                category,
            });
            const created = data?.data || data;
            const realId = created?.id;

            if (realId) {
                set((state) => ({
                    plan: {
                        ...state.plan,
                        places: state.plan.places.map((p) =>
                            p.id === tempId ? { ...p, id: realId } : p
                        ),
                    },
                }));
            }

            return true;
        } catch (err) {
            console.error("❌ Failed to add place to plan:", err);
            // 🔙 Rollback
            set((state) => ({
                plan: {
                    ...state.plan,
                    places: state.plan.places.filter((p) => p.id !== tempId),
                },
            }));
            return false;
        }
    },

    removePlace: async (placeId) => {
        const { plan } = get();
        const previousPlaces = plan.places;

        set((state) => ({
            plan: { ...state.plan, places: state.plan.places.filter((p) => p.id !== placeId) },
        }));

        if (!plan.id || String(placeId).startsWith("temp_")) return true;

        try {
            await plansService.removePlaceFromPlan(plan.id, placeId);
            return true;
        } catch (err) {
            console.error("❌ Failed to remove place:", err);
            // 🔙 Rollback
            set((state) => ({ plan: { ...state.plan, places: previousPlaces } }));
            return false;
        }
    },

    updatePlaceNote: async (placeId, note) => {
        const { plan } = get();
        const previousPlaces = plan.places;

        set((state) => ({
            plan: {
                ...state.plan,
                places: state.plan.places.map((p) => (p.id === placeId ? { ...p, note } : p)),
            },
        }));

        if (!plan.id || String(placeId).startsWith("temp_")) return;

        try {
            // NOTE: backend currently has no dedicated endpoint for patching a
            // single place's note. Until that exists, this call is a no-op
            // placeholder kept optimistic-only so the UI still feels responsive.
            // Swap this for a real PATCH /plans/{planId}/places/{placeId} call
            // once the backend supports it.
        } catch (err) {
            console.error("❌ Failed to update place note:", err);
            set({ plan: { ...plan, places: previousPlaces } });
        }
    },

    // ======================================================
    // NOTES (plan-level free-text notes list)
    // ======================================================

    addNote: async (noteText, options = {}) => {
        const trimmed = (noteText || "").trim();
        if (!trimmed) return;

        const { plan } = get();
        const newNotes = [...(plan.notes || []), trimmed];

        set((state) => ({ plan: { ...state.plan, notes: newNotes } }));

        try {
            const planId = await get().ensurePlanExists(options);
            await plansService.updatePlan(planId, { notes: newNotes });
        } catch (err) {
            console.error("❌ Failed to save note:", err);
            set((state) => ({
                plan: { ...state.plan, notes: (state.plan.notes || []).filter((n) => n !== trimmed) },
            }));
        }
    },

    removeNote: async (index) => {
        const { plan } = get();
        const previousNotes = plan.notes || [];
        const newNotes = previousNotes.filter((_, i) => i !== index);

        set((state) => ({ plan: { ...state.plan, notes: newNotes } }));

        if (!plan.id) return;

        try {
            await plansService.updatePlan(plan.id, { notes: newNotes });
        } catch (err) {
            console.error("❌ Failed to remove note:", err);
            set((state) => ({ plan: { ...state.plan, notes: previousNotes } }));
        }
    },
}));

export default useTripPlanStore;