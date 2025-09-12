import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Building2,
  Users,
  Calendar,
  Globe,
  Target,
  Lightbulb,
  MapPin,
  Handshake
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface Pavilion {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  objectives: string[];
  features: string[];
  targetAudience: string[];
  exhibitors: number;
  visitors: number;
  conferences: number;
}

const pavilions: Pavilion[] = [
  {
    id: 'digitalization',
    name: 'Digitalisation Portuaire',
    title: 'Automatisation et Numérisation',
    description: "Technologies numériques transformant l'écosystème portuaire",
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    objectives: ['Améliorer l\'efficacité opérationnelle', 'Réduire les temps d\'attente', 'Optimiser la gestion des ressources'],
    features: ['Solutions IoT portuaires', 'Systèmes de gestion automatisée', 'Intégration des systèmes d\'information'],
    targetAudience: ['Autorités Portuaires', 'Opérateurs de Terminaux', 'Développeurs de Solutions'],
    exhibitors: 8,
    visitors: 450,
    conferences: 3
  },
  {
    id: 'sustainability',
    name: 'Durabilité Portuaire',
    title: 'Écologie et Énergies Renouvelables',
    description: "Initiatives environnementales pour des ports durables",
    icon: Globe,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    objectives: ['Réduire l\'empreinte carbone', 'Développer les énergies renouvelables', 'Améliorer la qualité de l\'eau et de l\'air'],
    features: ['Électrification des quais', 'Solutions d\'énergie renouvelable', 'Gestion des déchets et économie circulaire'],
    targetAudience: ['Experts Environnementaux', 'Fournisseurs d\'Énergie', 'Autorités Portuaires'],
    exhibitors: 6,
    visitors: 380,
    conferences: 2
  },
  {
    id: 'security',
    name: 'Sécurité et Sûreté',
    title: 'Protection et Cybersécurité',
    description: "Solutions pour la sécurité physique et numérique des ports",
    icon: Users,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    objectives: ['Renforcer la cybersécurité', 'Améliorer la sûreté des opérations', 'Gérer les risques et crises'],
    features: ['Systèmes de surveillance intelligents', 'Solutions de cybersécurité maritime', 'Gestion des identités et accès'],
    targetAudience: ['Responsables Sécurité', 'Experts Cybersécurité', 'Autorités Douanières'],
    exhibitors: 5,
    visitors: 320,
    conferences: 2
  },
  {
    id: 'innovation',
    name: 'Innovation Portuaire',
    title: 'R&D et Startups',
    description: "Nouvelles technologies et modèles économiques portuaires",
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    objectives: ['Favoriser l\'innovation ouverte', 'Développer les partenariats', 'Accélérer la transformation numérique'],
    features: ['Zone de démonstration startups', 'Hackathon portuaire', 'Présentations de projets innovants'],
    targetAudience: ['Startups', 'Incubateurs', 'Investisseurs'],
    exhibitors: 12,
    visitors: 550,
    conferences: 4
  }
];

export default function PavillonsPage() {
  const [selectedPavilion, setSelectedPavilion] = useState<string | null>(null);
  const metrics = {
    totalExhibitors: 24,
    totalVisitors: 1200,
    totalConferences: 8,
    countries: 12
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold mb-4">Pavillons Thématiques SIPORTS 2026</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Hub central pour le développement, l'innovation et la connectivité mondiale de l'écosystème portuaire international</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4"><Building2 className="h-8 w-8 text-blue-600" /></div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalExhibitors}+</div>
            <div className="text-gray-600">Exposants</div>
          </Card>

          <Card className="text-center p-6">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4"><Users className="h-8 w-8 text-green-600" /></div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalVisitors.toLocaleString()}+</div>
            <div className="text-gray-600">Visiteurs Professionnels</div>
          </Card>

          <Card className="text-center p-6">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4"><Calendar className="h-8 w-8 text-purple-600" /></div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalConferences}+</div>
            <div className="text-gray-600">Conférences & Panels</div>
          </Card>

          <Card className="text-center p-6">
            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4"><Globe className="h-8 w-8 text-orange-600" /></div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.countries}</div>
            <div className="text-gray-600">Pays Représentés</div>
          </Card>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {pavilions.map((pavilion, index) => {
            const Icon = pavilion.icon;
            const isSelected = selectedPavilion === pavilion.id;
            return (
              <motion.div key={pavilion.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`${isSelected ? 'lg:col-span-2 xl:col-span-3' : ''}`}>
                <Card className={`h-full transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}>
                  <div className="p-6" onClick={() => setSelectedPavilion(isSelected ? null : pavilion.id)} style={{ cursor: 'pointer' }}>
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={`${pavilion.bgColor} p-3 rounded-lg`}><Icon className={`h-6 w-6 ${pavilion.color}`} /></div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{pavilion.name}</h3>
                        <p className="text-lg text-gray-700 font-medium mb-2">{pavilion.title}</p>
                        <p className="text-gray-600 text-sm">{pavilion.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center"><div className="text-2xl font-bold text-gray-900">{pavilion.exhibitors}</div><div className="text-xs text-gray-600">Exposants</div></div>
                      <div className="text-center"><div className="text-2xl font-bold text-gray-900">{pavilion.visitors.toLocaleString()}</div><div className="text-xs text-gray-600">Visiteurs</div></div>
                      <div className="text-center"><div className="text-2xl font-bold text-gray-900">{pavilion.conferences}</div><div className="text-xs text-gray-600">Conférences</div></div>
                    </div>

                    {isSelected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-gray-200 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><Target className="h-4 w-4 mr-2" />Objectifs</h4>
                            <ul className="space-y-2">{pavilion.objectives.map((o, i) => <li key={i} className="text-sm text-gray-600 flex items-start"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0" />{o}</li>)}</ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><Lightbulb className="h-4 w-4 mr-2" />Fonctionnalités</h4>
                            <ul className="space-y-2">{pavilion.features.map((f, i) => <li key={i} className="text-sm text-gray-600 flex items-start"><div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0" />{f}</li>)}</ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><Users className="h-4 w-4 mr-2" />Public Cible</h4>
                            <div className="space-y-2">{pavilion.targetAudience.map((t, i) => <Badge key={i} variant="info" size="sm" className="mr-2 mb-2">{t}</Badge>)}</div>
                          </div>
                        </div>

                        <div className="mt-6 flex space-x-4">
                          <Button onClick={() => toast.success(`Visite virtuelle lancée pour le pavillon ${pavilion.name}.`)}><MapPin className="h-4 w-4 mr-2" />Visiter le Pavillon</Button>
                          <Button variant="outline" onClick={() => toast.success(`Networking ouvert pour le pavillon ${pavilion.name}.`)}><Handshake className="h-4 w-4 mr-2" />Networking</Button>
                          <Button variant="outline" onClick={() => toast.success(`Programme du pavillon ${pavilion.name} affiché.`)}><Calendar className="h-4 w-4 mr-2" />Programme</Button>
                        </div>
                      </motion.div>
                    )}

                    {!isSelected && (
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" onClick={() => setSelectedPavilion(pavilion.id)}>Découvrir</Button>
                        <div className="text-xs text-gray-500">Cliquez pour plus de détails</div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

