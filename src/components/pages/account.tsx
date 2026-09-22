"use client";

import { useCustomerStore } from "@/lib/wishlist-store";
import { useRouter, Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Package, Heart, LogOut, ArrowRight } from "lucide-react";
import { useSeo } from "@/lib/use-seo";

export function AccountPage() {
  useSeo({
    title: "My Account — KEDI Healthcare",
    description: "Manage your KEDI Healthcare account, orders, and wishlist.",
    canonicalPath: "#/account",
    noIndex: true,
  });
  const navigate = useRouter().navigate;
  const customer = useCustomerStore();
  const signIn = useCustomerStore((s) => s.signIn);
  const signOut = useCustomerStore((s) => s.signOut);
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  if (customer.email) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-6 md:py-10 animate-fade-up">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
            <User className="h-7 w-7 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <AccountCard
            icon={Package}
            title="Order History"
            description="Track and review past orders"
            onClick={() => navigate("/orders")}
          />
          <AccountCard
            icon={Heart}
            title="Wishlist"
            description="Saved items ready to buy"
            onClick={() => navigate("/wishlist")}
          />
          <AccountCard
            icon={LogOut}
            title="Sign Out"
            description="End this session"
            onClick={() => { signOut(); toast.success("You've been signed out."); navigate("/"); }}
          />
        </div>

        <div className="mt-8 p-5 border border-border rounded-lg bg-card">
          <h2 className="font-semibold mb-2">Need help with an order?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Reach out to our team and we'll sort it out — usually within 24 hours.
          </p>
          <Link to="/contact"><Button variant="outline" size="sm">Contact Support</Button></Link>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    signIn({ email: email.trim(), firstName: firstName.trim(), lastName: lastName.trim() });
    toast.success(mode === "signin" ? "Welcome back!" : "Account created!");
    navigate("/orders");
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-10 animate-fade-up">
      <div className="border border-border rounded-lg p-6 bg-card">
        <h1 className="font-display text-2xl font-bold text-center mb-1">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "signin"
            ? "Access your orders and wishlist."
            : "Save your info for faster checkout next time."}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">First name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Last name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <Button type="submit" className="w-full">
            {mode === "signin" ? "Sign In" : "Create Account"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-4">
          {mode === "signin" ? (
            <>No account yet?{" "}
              <button onClick={() => setMode("register")} className="text-accent hover:underline">
                Create one
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="text-accent hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-4">
        Guest checkout is available too — you don't need an account to place an order.
      </p>
    </div>
  );
}

function AccountCard({
  icon: Icon, title, description, onClick,
}: {
  icon: any; title: string; description: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="text-left p-5 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <p className="font-semibold mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}
