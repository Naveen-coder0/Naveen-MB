import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Sparkles } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: Json;
  is_active: boolean;
}

interface MembershipCardProps {
  tier: MembershipTier;
  isCurrentPlan?: boolean;
  onSelect: (tier: MembershipTier) => void;
}

const tierIcons: Record<string, typeof Crown> = {
  Basic: Star,
  Premium: Crown,
  Elite: Sparkles,
};

const tierColors: Record<string, string> = {
  Basic: "from-gray-400 to-gray-600",
  Premium: "from-primary to-rose-dark",
  Elite: "from-gold to-amber-600",
};

const MembershipCard = ({ tier, isCurrentPlan, onSelect }: MembershipCardProps) => {
  const Icon = tierIcons[tier.name] || Star;
  const gradient = tierColors[tier.name] || tierColors.Basic;
  const features = Array.isArray(tier.features) ? tier.features : [];

  const durationText =
    tier.duration_days === 30
      ? "1 Month"
      : tier.duration_days === 90
      ? "3 Months"
      : tier.duration_days === 365
      ? "1 Year"
      : `${tier.duration_days} Days`;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-romantic ${
        isCurrentPlan ? "border-2 border-primary ring-2 ring-primary/20" : ""
      } ${tier.name === "Premium" ? "scale-105 z-10" : ""}`}
    >
      {tier.name === "Premium" && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-2">
        <div
          className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="font-serif text-2xl">{tier.name}</CardTitle>
        <CardDescription>{durationText}</CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        <div className="mb-6">
          <span className="text-4xl font-bold text-foreground">₹{tier.price.toLocaleString()}</span>
          <span className="text-muted-foreground">/{durationText.toLowerCase()}</span>
        </div>

        <ul className="space-y-3 text-left mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{String(feature)}</span>
            </li>
          ))}
        </ul>

        {isCurrentPlan ? (
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        ) : (
          <Button
            className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white`}
            onClick={() => onSelect(tier)}
          >
            Choose {tier.name}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
