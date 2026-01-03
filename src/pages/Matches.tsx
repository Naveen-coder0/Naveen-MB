import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import MatchInterestButton from "@/components/MatchInterestButton";
import { Heart, MapPin, User, Filter, Loader2, X } from "lucide-react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

/* ================= TYPES ================= */

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  gender: string;
  age: number;
  religion: string;
  location: string;
  email: string;
  bio: string | null;
  profile_photo: string | null;
}

interface MatchInterest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: string;
}

/* ================= DEMO PROFILES ================= */

const demoProfiles: Profile[] = [
  {
    id: "demo-1",
    user_id: "demo-user-1",
    full_name: "Priya Sharma",
    gender: "Female",
    age: 26,
    religion: "Hindu",
    location: "Delhi",
    email: "priya@example.com",
    bio: "Soft-spoken, family-oriented, and passionate about travel.",
    profile_photo: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "demo-2",
    user_id: "demo-user-2",
    full_name: "Anjali Verma",
    gender: "Female",
    age: 24,
    religion: "Hindu",
    location: "Chandigarh",
    email: "anjali@example.com",
    bio: "Creative soul, loves fashion and designing.",
    profile_photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "demo-3",
    user_id: "demo-user-3",
    full_name: "Simran Kaur",
    gender: "Female",
    age: 27,
    religion: "Sikh",
    location: "Amritsar",
    email: "simran@example.com",
    bio: "Warm-hearted, spiritual, and fitness enthusiast.",
    profile_photo: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "demo-4",
    user_id: "demo-user-4",
    full_name: "Neha Gupta",
    gender: "Female",
    age: 25,
    religion: "Jain",
    location: "Jaipur",
    email: "neha@example.com",
    bio: "Career-focused with strong family values.",
    profile_photo: "https://randomuser.me/api/portraits/women/32.jpg",
  },
];

/* ================= COMPONENT ================= */

const Matches = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [sentInterests, setSentInterests] = useState<MatchInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [filterReligion, setFilterReligion] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");

  const religions = [
    "Hindu",
    "Muslim",
    "Christian",
    "Sikh",
    "Buddhist",
    "Jain",
    "Other",
  ];

  /* ================= AUTH ================= */

  useEffect(() => {
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) navigate("/auth?mode=login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchCurrentProfile();
      fetchProfiles();
      fetchSentInterests();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [profiles, minAge, maxAge, filterReligion, filterLocation]);

  /* ================= DATA ================= */

  const fetchCurrentProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) setCurrentProfile(data);
  };

  const fetchProfiles = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select(
        "id, user_id, full_name, gender, age, religion, location, email, bio, profile_photo"
      )
      .neq("user_id", user.id);

    if (data && data.length > 0) {
      setProfiles(data);
      setFilteredProfiles(data);
    } else {
      // 👉 fallback to demo profiles
      setProfiles(demoProfiles);
      setFilteredProfiles(demoProfiles);
    }
    setIsLoading(false);
  };

  const fetchSentInterests = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("match_interests")
      .select("*")
      .eq("from_user_id", user.id);

    if (data) setSentInterests(data);
  };

  const getInterestForProfile = (profileUserId: string) =>
    sentInterests.find((i) => i.to_user_id === profileUserId) || null;

  /* ================= FILTERS ================= */

  const applyFilters = () => {
    let filtered = [...profiles];

    if (minAge) filtered = filtered.filter((p) => p.age >= +minAge);
    if (maxAge) filtered = filtered.filter((p) => p.age <= +maxAge);
    if (filterReligion !== "all")
      filtered = filtered.filter((p) => p.religion === filterReligion);
    if (filterLocation)
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(filterLocation.toLowerCase())
      );

    setFilteredProfiles(filtered);
  };

  const clearFilters = () => {
    setMinAge("");
    setMaxAge("");
    setFilterReligion("all");
    setFilterLocation("");
  };

  /* ================= UI ================= */

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold">Find Your Match</h1>
            <p className="text-muted-foreground">
              {filteredProfiles.length} profiles found
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className="cursor-pointer hover:shadow-lg transition"
            >
              <div className="aspect-square bg-muted flex items-center justify-center">
                {profile.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-20 w-20 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-serif text-lg font-semibold">
                  {profile.full_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profile.age} yrs • {profile.religion}
                </p>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {profile.location}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog */}
        <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
          <DialogContent>
            {selectedProfile && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedProfile.full_name}</DialogTitle>
                  <DialogDescription>Profile Details</DialogDescription>
                </DialogHeader>

                <p>{selectedProfile.bio}</p>

                {currentProfile && user && (
                  <MatchInterestButton
                    fromUserId={user.id}
                    toUserId={selectedProfile.user_id}
                    toUserName={selectedProfile.full_name}
                    toUserEmail={selectedProfile.email}
                    fromUserName={currentProfile.full_name}
                    existingInterest={getInterestForProfile(
                      selectedProfile.user_id
                    )}
                  />
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Matches;
