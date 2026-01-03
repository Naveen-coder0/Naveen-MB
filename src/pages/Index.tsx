import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { Heart, Users, Shield, Star, UserPlus, Search, MessageCircle, Quote } from "lucide-react";

const Index = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Profile",
      description: "Sign up and create your detailed profile with photos and preferences.",
    },
    {
      icon: Search,
      title: "Find Matches",
      description: "Browse through verified profiles that match your preferences.",
    },
    {
      icon: MessageCircle,
      title: "Connect & Meet",
      description: "Connect with your matches and take the first step towards forever.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All profiles are manually verified to ensure genuine connections.",
    },
    {
      icon: Users,
      title: "Family Values",
      description: "We prioritize family traditions and cultural compatibility.",
    },
    {
      icon: Heart,
      title: "Personalized Matching",
      description: "Our team personally helps you find your perfect life partner.",
    },
    {
      icon: Star,
      title: "Premium Service",
      description: "Dedicated relationship managers for a premium experience.",
    },
  ];

  const testimonials = [
    {
      name: "Priya & Rahul",
      text: "Naveen Marriage Bureau helped us find each other. We are forever grateful for their personalized service and care.",
      location: "Mumbai",
    },
    {
      name: "Anita & Vikram",
      text: "The team understood exactly what we were looking for. Now we're happily married for 2 years!",
      location: "Delhi",
    },
    {
      name: "Sneha & Arjun",
      text: "Professional, trustworthy, and truly dedicated to making matches that last a lifetime.",
      location: "Bangalore",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-rose-light opacity-60" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-peach/20 rounded-full blur-3xl" />
        </div>

        {/* Floating Hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-primary/20 fill-primary/10 animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
                width: `${20 + i * 5}px`,
                height: `${20 + i * 5}px`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Heart className="h-4 w-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">Trusted Since 2020</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Find Your{" "}
              <span className="text-primary relative">
                Perfect Match
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="hsl(var(--gold))" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <h2 className="font-serif text-2xl md:text-3xl text-muted-foreground mb-4">
              Aish Marriage Bureau
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              <span className="text-primary font-medium">Trusted Matches</span> •{" "}
              <span className="text-gold font-medium">Hearts United</span> •{" "}
              <span className="text-primary font-medium">For Life</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="shadow-romantic text-lg px-8 py-6 animate-glow">
                <Link to="/auth?mode=register">
                  <Heart className="h-5 w-5 mr-2 fill-current" />
                  Register Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-2">
                <Link to="/auth?mode=login">Login to Your Account</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>5000+ Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary fill-primary" />
                <span>1000+ Marriages</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-gold fill-gold" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Finding your soulmate is just three simple steps away
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <Card className="text-center p-6 hover:shadow-romantic transition-shadow border-2 border-transparent hover:border-primary/20">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center shadow-romantic">
                      <step.icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-medium mb-3">
                      Step {index + 1}
                    </span>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Why Choose Aish Marriage Bureau
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're more than just a matchmaking service – we're your partner in finding true love
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group p-6 hover:shadow-romantic transition-all duration-300 border-2 border-transparent hover:border-primary/20 hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-card">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real couples, real love, real happiness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-romantic transition-shadow">
                <CardContent className="p-0">
                  <Quote className="h-10 w-10 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary-foreground fill-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-rose-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 30l-5-5 5-5 5 5-5 5zm0 5l-5 5-5-5 5-5 5 5zm-5 5l-5-5 5-5 5 5-5 5zm10 0l-5-5 5-5 5 5-5 5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>
        <div className="container relative z-10 px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Ready to Find Your Soulmate?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of happy couples who found their perfect match with us.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6 shadow-gold">
            <Link to="/auth?mode=register">
              <Heart className="h-5 w-5 mr-2" />
              Start Your Journey Today
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
