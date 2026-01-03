import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Heart, Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = contactSchema.parse({ name, email, phone, message });

      const { error } = await supabase.from("contact_messages").insert({
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        message: validated.message,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Message Sent!",
          description: "We'll get back to you soon.",
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) newErrors[e.path[0] as string] = e.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "123-456-7890",
      href: "tel:123-456-7890",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@naveenmarriage.com",
      href: "mailto:info@naveenmarriage.com",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Wedding Lane, Love City, LC 12345",
      href: null,
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Mon-Fri: 9AM-7PM, Sat: 10AM-5PM",
      href: null,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-secondary via-background to-rose-light relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />

        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Heart className="h-4 w-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">Get In Touch</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Contact Us
            </h1>

            <p className="text-lg text-muted-foreground">
              Have questions? We'd love to hear from you. Reach out and let's start a conversation
              about finding your perfect match.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Reach Out to Us
                </h2>
                <p className="text-muted-foreground mb-8">
                  Whether you have a question about our services, need assistance with your profile,
                  or just want to share your success story, we're here to help.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{info.title}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Placeholder */}
                <div className="mt-8 aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-gold/10 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Location Map</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="shadow-romantic border-2">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                        Thank You!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Your message has been sent successfully. We'll get back to you soon.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSubmitted(false);
                          setName("");
                          setEmail("");
                          setPhone("");
                          setMessage("");
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={5}
                          required
                        />
                        {errors.message && (
                          <p className="text-sm text-destructive">{errors.message}</p>
                        )}
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Website Info */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
              Visit Us Online
            </h3>
            <p className="text-muted-foreground mb-4">
              🌐 <span className="text-primary font-medium">www.aishmarriage.com</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Browse profiles, create your account, and start your journey to finding love today.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
