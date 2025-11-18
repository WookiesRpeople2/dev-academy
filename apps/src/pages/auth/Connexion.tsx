import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KeyRound, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const emitAuthChanged = () => window.dispatchEvent(new Event("auth-changed"));
  const afterLogin = () => {
    const from = (location.state as any)?.from as string | undefined;
    navigate(from ?? "/programmes", { replace: true });
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function hashPassword(pw: string) {
    const enc = new TextEncoder().encode(pw);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  const SECRET = "devacademy-demo-secret";
  async function issueToken(subject: string) {
    const payload = {
      sub: subject,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    };
    const payloadStr = JSON.stringify(payload);
    const data = new TextEncoder().encode(payloadStr + SECRET);
    const digest = await crypto.subtle.digest("SHA-256", data);
    const arr = Array.from(new Uint8Array(digest));
    const sig = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
    localStorage.setItem("tokenPayload", payloadStr);
    localStorage.setItem("tokenSig", sig);
    localStorage.setItem("tokenExp", String(payload.exp));
    emitAuthChanged();
  }
  const loginSimple = useCallback(() => {
    toast.error("Passkey indisponible sur cet appareil");
  }, []);
  const loginWithPassword = useCallback(async () => {
    if (!email || !password) {
      toast.error("Veuillez saisir votre email et mot de passe");
      return;
    }
    try {
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      const user = users[email];
      if (!user) {
        toast.error("Compte introuvable");
        return;
      }
      const hash = await hashPassword(password);
      if (user.passwordHash !== hash) {
        toast.error("Mot de passe invalide");
        return;
      }
      localStorage.setItem("currentUser", email);
      await issueToken(email);
      afterLogin();
    } catch {
      toast.error("Erreur de connexion");
    }
  }, [email, password, loginSimple]);
  const loginWithPasskey = useCallback(async () => {
    try {
      if (!("PublicKeyCredential" in window)) {
        toast.error("Passkey non supporté");
        return;
      }
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const cred = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          allowCredentials: [],
          userVerification: "preferred",
        },
        mediation: "optional",
      } as any);
      if (cred) {
        await issueToken("passkey-user");
        afterLogin();
      } else {
        toast.error("Échec de la connexion Passkey");
      }
    } catch {
      toast.error("Erreur Passkey");
    }
  }, [loginSimple]);
  const createPasskey = useCallback(async () => {
    try {
      if (!("PublicKeyCredential" in window)) {
        toast.error("Passkey non supporté");
        return;
      }
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "DevAcademy", id: window.location.hostname },
          user: { id: userId, name: "user", displayName: "Utilisateur" },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          authenticatorSelection: { residentKey: "preferred" },
        },
        signal: undefined,
      } as any);
      if (cred) {
        await issueToken("passkey-user");
        afterLogin();
      } else {
        toast.error("Création de Passkey annulée");
      }
    } catch {
      toast.error("Erreur lors de la création de Passkey");
    }
  }, [loginSimple]);
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Se connecter</h2>
          <p className="text-sm text-muted-foreground">Choisissez une méthode d’authentification</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button onClick={loginWithPassword} className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Se connecter
            </Button>
          </div>
          <div className="space-y-3">
            <Button onClick={loginWithPasskey} className="w-full">
              <KeyRound className="mr-2 h-4 w-4" /> Se connecter avec Passkey
            </Button>
            <Button onClick={createPasskey} variant="outline" className="w-full">
              <KeyRound className="mr-2 h-4 w-4" /> Créer une Passkey
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}