-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Storage policies for profile photos
CREATE POLICY "Users can upload their own profile photo"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile photo"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile photos are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can delete their own profile photo"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create membership_tiers table
CREATE TABLE public.membership_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  duration_days integer NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default membership tiers
INSERT INTO public.membership_tiers (name, price, duration_days, features) VALUES
('Basic', 0, 0, '["View profiles", "Basic search filters", "Limited contact requests"]'),
('Silver', 999, 30, '["All Basic features", "Unlimited contact requests", "See who viewed you", "Priority support"]'),
('Gold', 2499, 90, '["All Silver features", "Featured profile badge", "Advanced matching", "Video calls"]'),
('Platinum', 4999, 180, '["All Gold features", "Personal matchmaker", "Background verification badge", "Premium support 24/7"]');

-- Create user_memberships table
CREATE TABLE public.user_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tier_id uuid NOT NULL REFERENCES public.membership_tiers(id),
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  payment_reference text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on membership tables
ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

-- Membership tiers are public to view
CREATE POLICY "Anyone can view active membership tiers"
ON public.membership_tiers FOR SELECT
USING (is_active = true);

-- Users can view their own memberships
CREATE POLICY "Users can view their own memberships"
ON public.user_memberships FOR SELECT
USING (user_id = auth.uid());

-- Only admins can insert memberships (after payment verification)
CREATE POLICY "Admins can manage memberships"
ON public.user_memberships FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create match_interests table for expressing interest
CREATE TABLE public.match_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

ALTER TABLE public.match_interests ENABLE ROW LEVEL SECURITY;

-- Users can send interest
CREATE POLICY "Users can send interest"
ON public.match_interests FOR INSERT
WITH CHECK (from_user_id = auth.uid());

-- Users can view interests they sent or received
CREATE POLICY "Users can view their interests"
ON public.match_interests FOR SELECT
USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

-- Users can update interests sent to them (accept/decline)
CREATE POLICY "Users can respond to received interests"
ON public.match_interests FOR UPDATE
USING (to_user_id = auth.uid());

-- Admins can view all interests
CREATE POLICY "Admins can view all interests"
ON public.match_interests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_match_interests_updated_at
BEFORE UPDATE ON public.match_interests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create notifications table for email notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('profile_approved', 'match_interest', 'interest_accepted', 'interest_declined')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  is_emailed boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- System/admins can insert notifications
CREATE POLICY "Admins can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can insert notifications for match interests they send
CREATE POLICY "Users can create match interest notifications"
ON public.notifications FOR INSERT
WITH CHECK (type = 'match_interest');