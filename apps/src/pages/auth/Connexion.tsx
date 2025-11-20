import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KeyRound, LogIn, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const toast = {
  success: (msg: string) => console.log("Success:", msg),
  error: (msg: string) => console.error("Error:", msg),
};

export const Connexion = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emitAuthChanged = () => window.dispatchEvent(new Event("auth-changed"));
  const afterLogin = () => navigate("/");

  const bufferToBase64url = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  const signup = useCallback(async () => {
    if (!email || !password) return toast.error("Veuillez remplir les champs");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:9090/api/auth/signup/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return toast.error("Impossible de créer le compte");
      toast.success("Compte créé ! Vous pouvez maintenant créer une Passkey.");
    } catch (e) {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const loginWithPassword = useCallback(async () => {
    if (!email || !password) return toast.error("Veuillez remplir les champs");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9090/api/auth/login/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) return toast.error("Identifiants invalides");
      toast.success("Connexion réussie");
      emitAuthChanged();
      afterLogin();
    } catch (e) {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const loginWithPasskey = useCallback(async () => {
    if (!email) return toast.error("Veuillez saisir votre email");
    setLoading(true);
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: "preferred",
        timeout: 60000,
      };

      const credential = await navigator.credentials.get({ publicKey: publicKeyOptions }) as PublicKeyCredential;
      if (!credential) return toast.error("Authentification annulée");

      const response = credential.response as AuthenticatorAssertionResponse;

      const loginResponse = await fetch("http://localhost:9090/api/auth/login/passkey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          credential_id: bufferToBase64url(credential.rawId),
          signature: bufferToBase64url(response.signature),
          authenticator_data: bufferToBase64url(response.authenticatorData),
          client_data: bufferToBase64url(response.clientDataJSON),
        })
      });

      if (!loginResponse.ok) return toast.error("Passkey invalide");
      toast.success("Connecté avec Passkey !");
      emitAuthChanged();
      afterLogin();
    } catch (e) {
      console.error(e);
      toast.error("Erreur avec Passkey");
    } finally {
      setLoading(false);
    }
  }, [email]);

  const registerPasskey = useCallback(async () => {
    if (!email) return toast.error("Email requis");
    setLoading(true);
    try {
      if (!window.PublicKeyCredential) {
        toast.error("Les Passkeys ne sont pas supportées sur cet appareil");
        return;
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "DevAcademy", id: window.location.hostname },
        user: { id: userId, name: email, displayName: email },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: {
          residentKey: "preferred",
          userVerification: "preferred",
        },
        timeout: 60000,
        attestation: "none",
      };

      const credential = await navigator.credentials.create({ publicKey: publicKeyOptions }) as PublicKeyCredential;
      if (!credential) return toast.error("Création annulée");

      const response = credential.response as AuthenticatorAttestationResponse;

      const registerResponse = await fetch("http://localhost:9090/api/auth/passkey/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          credential_id: bufferToBase64url(credential.rawId),
          public_key: bufferToBase64url((response as any).getPublicKey?.() ?? new ArrayBuffer(0)),
          counter: 0,
        })
      });

      if (!registerResponse.ok) return toast.error("Impossible d'enregistrer la Passkey");
      toast.success("Passkey créée !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la création de Passkey");
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <div className="flex items-center justify-center min-h-screen py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-lg">

        <div className="flex justify-center gap-4 mb-4">
          <Button variant={mode === "login" ? "default" : "outline"} onClick={() => setMode("login")}>Login</Button>
          <Button variant={mode === "signup" ? "default" : "outline"} onClick={() => setMode("signup")}>Créer compte</Button>
        </div>

        {mode === "login" ? (
          <>
            <h2 className="text-2xl font-bold text-center">Se connecter</h2>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            <Label>Mot de passe</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={loginWithPassword} className="w-full mt-4">
              <LogIn className="mr-2 h-4 w-4" /> Se connecter
            </Button>
            <Button onClick={loginWithPasskey} variant="secondary" className="w-full mt-2">
              <KeyRound className="mr-2 h-4 w-4" /> Login Passkey
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">Créer un compte</h2>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            <Label>Mot de passe</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={signup} className="w-full mt-4">
              <UserPlus className="mr-2 h-4 w-4" /> Créer le compte
            </Button>

            <p className="text-center text-xs text-slate-500 mt-4">Créer une Passkey pour ce nouveau compte :</p>
            <Button onClick={registerPasskey} variant="outline" className="w-full mt-2 h-11">
              <KeyRound className="mr-2 h-4 w-4" /> Enregistrer Passkey
            </Button>
          </>
        )}

      </Card>
    </div>
  );
};

