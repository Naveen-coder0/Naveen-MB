import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* --------------------------------------------------
     HANDLE OAUTH CALLBACK + SESSION
     This converts #access_token into a session
  -------------------------------------------------- */
//  useEffect(() => {
//   const { data: authListener } = supabase.auth.onAuthStateChange(
//     (_event, session) => {
//       if (session) {
//         navigate("/dashboard", { replace: true });
//       }
//     }
//   );

//   return () => {
//     authListener.subscription.unsubscribe();
//   };
// }, [navigate]);
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    console.log("SESSION 👉", data.session);
  });
}, []);

  /* ---------------- GOOGLE LOGIN ---------------- */
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      },
    });

    if (error) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /* ---------------- EMAIL LOGIN ---------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({ title: "Login successful" });
    navigate("/dashboard");
    setLoading(false);
  };

  /* ---------------- REGISTER ---------------- */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const user = data?.user;

    // Email confirmation ON
    if (!user) {
      toast({
        title: "Verify your email",
        description: "Check your inbox before logging in.",
      });
      setLoading(false);
      return;
    }

    // Create profile (TS-safe)
    await supabase.from("profiles").insert([
      {
        user_id: user.id,
        email: user.email,
      } as any,
    ]);

    toast({ title: "Account created successfully" });
    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-rose-light">
      <div className="w-full max-w-md p-4">
        <Link to="/" className="flex items-center gap-2 mb-4 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <Heart className="mx-auto h-10 w-10 text-primary" />
            <CardTitle>
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Sign in to continue"
                : "Join Naveen Marriage Bureau"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
              Continue with Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            <form
              onSubmit={mode === "login" ? handleLogin : handleRegister}
              className="space-y-3"
            >
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm">
              {mode === "login" ? (
                <>
                  No account?{" "}
                  <Link to="/auth?mode=register" className="text-primary">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link to="/auth?mode=login" className="text-primary">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
