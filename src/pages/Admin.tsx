import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import {
  Users,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Shield,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  gender: string;
  age: number;
  religion: string;
  location: string;
  phone: string;
  email: string;
  bio: string | null;
  is_approved: boolean;
  is_disabled: boolean;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

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
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (data) {
      setIsAdmin(true);
      fetchProfiles();
      fetchMessages();
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProfiles(data);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleApproveProfile = async (profileId: string, approve: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_approved: approve })
      .eq("id", profileId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: approve ? "Profile approved" : "Profile approval revoked",
      });
      fetchProfiles();
      setSelectedProfile(null);
    }
  };

  const handleDisableProfile = async (profileId: string, disable: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_disabled: disable })
      .eq("id", profileId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: disable ? "Profile disabled" : "Profile enabled",
      });
      fetchProfiles();
      setSelectedProfile(null);
    }
  };

  const handleMarkMessageRead = async (messageId: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (!error) {
      fetchMessages();
    }
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

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Card className="max-w-md text-center p-8">
            <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin panel.
            </p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </Card>
        </div>
      </Layout>
    );
  }

  const pendingProfiles = profiles.filter((p) => !p.is_approved && !p.is_disabled);
  const approvedProfiles = profiles.filter((p) => p.is_approved && !p.is_disabled);
  const disabledProfiles = profiles.filter((p) => p.is_disabled);
  const unreadMessages = messages.filter((m) => !m.is_read);

  return (
    <Layout>
      <div className="container py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center shadow-romantic">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage profiles and messages</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{approvedProfiles.length}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-amber-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pendingProfiles.length}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{unreadMessages.length}</p>
                    <p className="text-sm text-muted-foreground">Unread Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profiles" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profiles" className="gap-2">
                <Users className="h-4 w-4" />
                User Profiles
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact Messages
                {unreadMessages.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {unreadMessages.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Profiles Tab */}
            <TabsContent value="profiles">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">All User Profiles</CardTitle>
                  <CardDescription>
                    View, approve, or disable user profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Details</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profiles.map((profile) => (
                          <tr key={profile.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{profile.full_name}</p>
                                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-sm text-muted-foreground">
                                {profile.age} yrs • {profile.gender} • {profile.religion}
                              </p>
                              <p className="text-sm text-muted-foreground">{profile.location}</p>
                            </td>
                            <td className="py-3 px-4">
                              {profile.is_disabled ? (
                                <Badge variant="destructive">Disabled</Badge>
                              ) : profile.is_approved ? (
                                <Badge className="bg-green-500">Approved</Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProfile(profile)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Contact Messages</CardTitle>
                  <CardDescription>View messages from contact form</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No messages yet</p>
                    ) : (
                      messages.map((msg) => (
                        <Card
                          key={msg.id}
                          className={`cursor-pointer hover:shadow-md transition-shadow ${
                            !msg.is_read ? "border-primary" : ""
                          }`}
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (!msg.is_read) {
                              handleMarkMessageRead(msg.id);
                            }
                          }}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">{msg.name}</p>
                                  {!msg.is_read && (
                                    <Badge variant="default" className="text-xs">New</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{msg.email}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(msg.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {msg.message}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Profile Detail Dialog */}
          <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Profile Details</DialogTitle>
                <DialogDescription>View and manage this user profile</DialogDescription>
              </DialogHeader>
              {selectedProfile && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {selectedProfile.full_name}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        {selectedProfile.is_disabled ? (
                          <Badge variant="destructive">Disabled</Badge>
                        ) : selectedProfile.is_approved ? (
                          <Badge className="bg-green-500">Approved</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p className="font-medium">{selectedProfile.age} years</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium">{selectedProfile.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Religion</p>
                      <p className="font-medium">{selectedProfile.religion}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedProfile.location}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedProfile.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedProfile.phone}</p>
                    </div>
                    {selectedProfile.bio && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Bio</p>
                        <p className="font-medium">{selectedProfile.bio}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    {!selectedProfile.is_approved && !selectedProfile.is_disabled && (
                      <Button
                        className="flex-1"
                        onClick={() => handleApproveProfile(selectedProfile.id, true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    {selectedProfile.is_approved && !selectedProfile.is_disabled && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleApproveProfile(selectedProfile.id, false)}
                      >
                        Revoke Approval
                      </Button>
                    )}
                    {!selectedProfile.is_disabled ? (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDisableProfile(selectedProfile.id, true)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Disable
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDisableProfile(selectedProfile.id, false)}
                      >
                        Enable Profile
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Message Detail Dialog */}
          <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif">Message Details</DialogTitle>
                <DialogDescription>
                  From {selectedMessage?.name}
                </DialogDescription>
              </DialogHeader>
              {selectedMessage && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="text-primary hover:underline"
                      >
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Message</p>
                    <p className="text-foreground mt-1">{selectedMessage.message}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Received</p>
                    <p className="text-foreground">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
