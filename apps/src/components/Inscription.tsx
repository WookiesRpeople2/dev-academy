import { useState } from 'react';
import { UserPlus, Mail, Lock, User, Phone, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

export function Inscription() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setSubmitted(true);
    toast.success('Inscription réussie! Bienvenue sur DevAcademy 🎉');
  };

  if (submitted) {
    return (
      <div className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="mb-4 text-zinc-50">Inscription réussie!</h2>
            <p className="mb-8 text-zinc-400">
              Bienvenue {formData.firstName}! Votre compte a été créé avec succès. 
              Vous allez recevoir un email de confirmation à {formData.email}.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-zinc-500">Prochaines étapes:</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Vérifiez votre email pour activer votre compte
                </li>
                <li className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Complétez votre profil
                </li>
                <li className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Explorez nos cours et commencez à apprendre
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-2 text-zinc-50">Créer un compte</h2>
          <p className="text-zinc-400">
            Rejoignez DevAcademy et commencez votre parcours d'apprentissage
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-zinc-300">
                  Prénom *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                    placeholder="John"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-zinc-300">
                  Nom *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">
                Téléphone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">
                  Confirmer le mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-zinc-800 pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, acceptTerms: checked as boolean })
                  }
                  className="border-zinc-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="terms" className="text-sm text-zinc-400 cursor-pointer">
                  J'accepte les conditions d'utilisation et la politique de confidentialité *
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, newsletter: checked as boolean })
                  }
                  className="border-zinc-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="newsletter" className="text-sm text-zinc-400 cursor-pointer">
                  Je souhaite recevoir les actualités et offres de DevAcademy
                </Label>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white border-0"
            >
              S'inscrire
            </Button>

            <p className="text-center text-sm text-zinc-500">
              Déjà un compte?{' '}
              <button type="button" className="text-blue-400 hover:text-blue-300 hover:underline">
                Se connecter
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
