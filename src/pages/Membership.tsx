import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import MembershipCard from "@/components/MembershipCard";
import { Crown, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { Json } from "@/integrations/supabase/types";

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: Json;
  is_active: boolean;
}

interface UserMembership {
  id: string;
  tier_id: string;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  membership_tiers: MembershipTier;
}

const Membership = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [currentMembership, setCurrentMembership] = useState<UserMembership | null>(null);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      fetchTiers();
      fetchCurrentMembership();
    }
  }, [user]);

  const fetchTiers = async () => {
    const { data, error } = await supabase
      .from("membership_tiers")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (!error && data) {
      setTiers(data);
    }
    setIsLoading(false);
  };

  const fetchCurrentMembership = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_memberships")
      .select(`
        *,
        membership_tiers (*)
      `)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .order("expires_at", { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setCurrentMembership(data as UserMembership);
    }
  };

  const handleSelectTier = (tier: MembershipTier) => {
    setSelectedTier(tier);
  };

  const handlePurchase = async () => {
    if (!selectedTier || !user) return;

    setIsProcessing(true);

    try {
      // For now, create a membership directly (in production, this would go through payment)
      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + selectedTier.duration_days);

      // Deactivate existing memberships
      await supabase
        .from("user_memberships")
        .update({ is_active: false })
        .eq("user_id", user.id);

      // Create new membership
      const { error } = await supabase.from("user_memberships").insert({
        user_id: user.id,
        tier_id: selectedTier.id,
        starts_at: startsAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_active: true,
        payment_reference: `MANUAL_${Date.now()}`,
      });

      if (error) throw error;

      toast({
        title: "Membership activated!",
        description: `Your ${selectedTier.name} membership is now active`,
      });

      setSelectedTier(null);
      fetchCurrentMembership();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to activate membership",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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

  return (
    <Layout>
      <div className="container py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-rose-dark mb-6">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
              Premium Memberships
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock exclusive features and connect with more potential matches. Choose the plan
              that's right for you.
            </p>
          </div>

          {/* Current Membership */}
          {currentMembership && (
            <Card className="mb-12 border-primary/20 bg-gradient-to-r from-primary/5 to-rose-light/10">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Your Current Plan: {currentMembership.membership_tiers.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires on {new Date(currentMembership.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary text-primary">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Membership Tiers */}
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {tiers.map((tier) => (
              <MembershipCard
                key={tier.id}
                tier={tier}
                isCurrentPlan={currentMembership?.tier_id === tier.id}
                onSelect={handleSelectTier}
              />
            ))}
          </div>

          {/* Purchase Dialog */}
          <Dialog open={!!selectedTier} onOpenChange={() => setSelectedTier(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif">Confirm Membership</DialogTitle>
                <DialogDescription>
                  You're about to activate {selectedTier?.name} membership
                </DialogDescription>
              </DialogHeader>

              {selectedTier && (
                <div className="py-4 space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium">{selectedTier.name} Plan</span>
                    <span className="text-xl font-bold">₹{selectedTier.price.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    <p>Duration: {selectedTier.duration_days} days</p>
                    <p className="mt-2">
                      Note: For demo purposes, membership will be activated immediately.
                      <br />
                      In production, this would redirect to a payment gateway.
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTier(null)}>
                  Cancel
                </Button>
                <Button onClick={handlePurchase} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm & Activate"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I upgrade my plan?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Simply choose a higher tier plan. Your new plan will start immediately, and you
                    can enjoy all the premium features right away.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods are accepted?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit/debit cards, UPI, net banking, and popular digital
                    wallets for your convenience.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I cancel my membership?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can cancel anytime. Your membership will remain active until the end of
                    your current billing period.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a refund policy?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We offer a 7-day money-back guarantee for first-time subscribers if you're not
                    satisfied with our service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Membership;
