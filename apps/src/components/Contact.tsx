import { useState } from 'react';
import { MessageSquare, Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface Advisor {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  availability: string;
}

const advisors: Advisor[] = [
  {
    id: '1',
    name: 'Sophie Lefevre',
    role: 'Conseillère Web & Mobile',
    specialties: ['React', 'React Native', 'Node.js'],
    availability: 'Lun-Ven 9h-18h'
  },
  {
    id: '2',
    name: 'Marc Rousseau',
    role: 'Conseiller Data & IA',
    specialties: ['Python', 'Machine Learning', 'Data Analysis'],
    availability: 'Lun-Ven 10h-19h'
  },
  {
    id: '3',
    name: 'Julie Martin',
    role: 'Conseillère Cloud & DevOps',
    specialties: ['AWS', 'Docker', 'Kubernetes'],
    availability: 'Lun-Ven 8h-17h'
  }
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    selectedAdvisor: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Message envoyé! Un conseiller vous répondra sous 24h');
  };

  if (submitted) {
    return (
      <div className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="mb-4 text-zinc-50">Message envoyé!</h2>
            <p className="mb-8 text-zinc-400">
              Merci {formData.name}! Votre message a été envoyé avec succès. 
              Un conseiller vous répondra dans les plus brefs délais à {formData.email}.
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-0"
            >
              Envoyer un autre message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-zinc-50">Contactez un conseiller</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Nos conseillers sont là pour vous accompagner dans votre parcours de formation
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-zinc-50">Envoyez-nous un message</h3>
                  <p className="text-sm text-zinc-400">Réponse sous 24h</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-300">
                      Nom complet *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-zinc-300">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-zinc-300">
                    Sujet *
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                    placeholder="Question sur un cours..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-zinc-300">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="min-h-[150px] bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white border-0"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-zinc-50">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-zinc-800 p-2">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <p className="text-zinc-100">contact@devacademy.fr</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-zinc-800 p-2">
                    <Phone className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Téléphone</p>
                    <p className="text-zinc-100">+33 1 23 45 67 89</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-zinc-800 p-2">
                    <MapPin className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Adresse</p>
                    <p className="text-zinc-100">42 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-zinc-800 p-2">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Horaires</p>
                    <p className="text-zinc-100">Lun-Ven: 8h-19h<br />Sam: 9h-13h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advisors */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-zinc-50">Nos conseillers</h3>
              <div className="space-y-4">
                {advisors.map((advisor) => (
                  <div key={advisor.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                    <p className="mb-1 text-zinc-100">{advisor.name}</p>
                    <p className="mb-2 text-sm text-zinc-400">{advisor.role}</p>
                    <div className="mb-2 flex flex-wrap gap-1">
                      {advisor.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-400"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500">{advisor.availability}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
