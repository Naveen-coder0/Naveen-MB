import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import PhotoUpload from "@/components/PhotoUpload";
import { Heart, User, Settings, Loader2, Save, Crown, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string;
  gender: string;
  age: number;
  religion: string;
  location: string;
  phone: string;
  email: string;
  bio: string | null;
  profile_photo: string | null;
  is_approved: boolean;
}

interface Preferences {
  id?: string;
  min_age: number | null;
  max_age: number | null;
  preferred_religion: string | null;
  preferred_location: string | null;
  additional_preferences: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({
    min_age: null,
    max_age: null,
    preferred_religion: null,
    preferred_location: null,
    additional_preferences: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other", "Any"];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth?mode=login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      }
    } else {
      setProfile(data);
    }
    setIsLoading(false);
  };

  const fetchPreferences = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setPreferences(data);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        gender: profile.gender,
        age: profile.age,
        religion: profile.religion,
        location: profile.location,
        phone: profile.phone,
        bio: profile.bio,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
    setIsSaving(false);
  };

  const handleUpdatePreferences = async () => {
    if (!user) return;
    setIsSaving(true);

    const prefData = {
      user_id: user.id,
      min_age: preferences.min_age,
      max_age: preferences.max_age,
      preferred_religion: preferences.preferred_religion,
      preferred_location: preferences.preferred_location,
      additional_preferences: preferences.additional_preferences,
    };

    const { error } = preferences.id
      ? await supabase.from("preferences").update(prefData).eq("user_id", user.id)
      : await supabase.from("preferences").insert(prefData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
      fetchPreferences();
    }
    setIsSaving(false);
  };

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center shadow-romantic">
              {profile?.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt={profile.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-primary-foreground" />
              )}
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Welcome, {profile?.full_name?.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                {profile?.is_approved ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Profile Approved
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Pending Approval
                  </>
                )}
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                My Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Heart className="h-4 w-4" />
                Partner Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Edit Profile
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo Upload */}
                  <PhotoUpload
                    currentPhotoUrl={profile?.profile_photo || null}
                    userId={user?.id || ""}
                    onPhotoUpdated={(url) => setProfile((p) => p && { ...p, profile_photo: url || null })}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile?.full_name || ""}
                        onChange={(e) => setProfile((p) => p && { ...p, full_name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={profile?.gender || ""}
                        onValueChange={(v) => setProfile((p) => p && { ...p, gender: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={profile?.age || ""}
                        onChange={(e) =>
                          setProfile((p) => p && { ...p, age: parseInt(e.target.value) })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="religion">Religion</Label>
                      <Select
                        value={profile?.religion || ""}
                        onValueChange={(v) => setProfile((p) => p && { ...p, religion: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {religions.slice(0, -1).map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile?.location || ""}
                        onChange={(e) => setProfile((p) => p && { ...p, location: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile?.phone || ""}
                        onChange={(e) => setProfile((p) => p && { ...p, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-span-full space-y-2">
                      <Label htmlFor="bio">About Me</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={profile?.bio || ""}
                        onChange={(e) => setProfile((p) => p && { ...p, bio: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button onClick={handleUpdateProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Partner Preferences
                  </CardTitle>
                  <CardDescription>
                    Tell us what you're looking for in a life partner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAge">Minimum Age</Label>
                      <Input
                        id="minAge"
                        type="number"
                        min="18"
                        placeholder="e.g., 25"
                        value={preferences.min_age || ""}
                        onChange={(e) =>
                          setPreferences((p) => ({
                            ...p,
                            min_age: parseInt(e.target.value) || null,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAge">Maximum Age</Label>
                      <Input
                        id="maxAge"
                        type="number"
                        min="18"
                        placeholder="e.g., 35"
                        value={preferences.max_age || ""}
                        onChange={(e) =>
                          setPreferences((p) => ({
                            ...p,
                            max_age: parseInt(e.target.value) || null,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prefReligion">Preferred Religion</Label>
                      <Select
                        value={preferences.preferred_religion || ""}
                        onValueChange={(v) =>
                          setPreferences((p) => ({ ...p, preferred_religion: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select religion" />
                        </SelectTrigger>
                        <SelectContent>
                          {religions.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prefLocation">Preferred Location</Label>
                      <Input
                        id="prefLocation"
                        placeholder="e.g., Mumbai, Delhi"
                        value={preferences.preferred_location || ""}
                        onChange={(e) =>
                          setPreferences((p) => ({ ...p, preferred_location: e.target.value }))
                        }
                      />
                    </div>

                    <div className="col-span-full space-y-2">
                      <Label htmlFor="addlPrefs">Additional Preferences</Label>
                      <Textarea
                        id="addlPrefs"
                        placeholder="Any other preferences you'd like us to know..."
                        value={preferences.additional_preferences || ""}
                        onChange={(e) =>
                          setPreferences((p) => ({
                            ...p,
                            additional_preferences: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button onClick={handleUpdatePreferences} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
