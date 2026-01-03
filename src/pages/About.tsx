import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Award, Clock, Handshake } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Love & Commitment",
      description:
        "We believe in the power of true love and lifelong commitment. Every match we make is aimed at creating lasting relationships.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Your privacy and security are our top priorities. All profiles are verified and personal information is kept confidential.",
    },
    {
      icon: Users,
      title: "Family Values",
      description:
        "We understand the importance of family in marriage. Our matches consider cultural and family compatibility.",
    },
    {
      icon: Handshake,
      title: "Personalized Service",
      description:
        "Every client receives personalized attention. Our team works closely with you to understand your preferences.",
    },
  ];

  const stats = [
    { number: "5000+", label: "Registered Members" },
    { number: "1000+", label: "Successful Marriages" },
    { number: "5+", label: "Years of Service" },
    { number: "98%", label: "Client Satisfaction" },
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
              <span className="text-sm font-medium text-primary">Our Story</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Naveen Marriage Bureau
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded with a vision to unite hearts and create lasting relationships, Naveen Marriage
              Bureau has been helping families find the perfect match since 2020. Our commitment to
              traditional values combined with modern matchmaking techniques makes us the trusted
              choice for thousands of families.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-card">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                  Our Journey
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Naveen Marriage Bureau was born from a simple belief – that everyone deserves to
                    find their soulmate. What started as a small family-run service has grown into
                    one of the most trusted matrimonial bureaus in the region.
                  </p>
                  <p>
                    Our founder, with over 20 years of experience in bringing families together,
                    established this bureau with a focus on genuine connections rather than just
                    matching profiles. We take pride in understanding each individual's unique needs
                    and preferences.
                  </p>
                  <p>
                    Today, we continue to uphold the same values of trust, respect, and personalized
                    service that have made us the preferred choice for families seeking meaningful
                    matrimonial alliances.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="h-24 w-24 text-primary mx-auto mb-4 fill-primary/30" />
                    <p className="font-serif text-2xl text-foreground">Hearts United</p>
                    <p className="text-muted-foreground">Since 2020</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/20 rounded-full blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary to-rose-dark">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.number}
                </p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide us in helping you find your perfect life partner
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-romantic transition-shadow border-2 border-transparent hover:border-primary/20"
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center shadow-romantic">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-card">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To create meaningful and lasting matrimonial connections by understanding the unique
              needs of each individual and family. We strive to be more than just a matchmaking
              service – we aim to be your trusted partner in finding love and building a beautiful
              future together.
            </p>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-16 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
              Why Families Trust Us
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Verified Profiles</h3>
                  <p className="text-sm text-muted-foreground">
                    Every profile is thoroughly verified to ensure genuine connections
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Dedicated Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team is available to assist you throughout your journey
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Family Involvement</h3>
                  <p className="text-sm text-muted-foreground">
                    We welcome and encourage family participation in the process
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Success Track Record</h3>
                  <p className="text-sm text-muted-foreground">
                    Over 1000 successful marriages and counting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
