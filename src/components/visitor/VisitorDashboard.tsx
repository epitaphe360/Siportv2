import { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star,
  Building2,
  Network,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function VisitorDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [stats] = useState({
    appointmentsBooked: 3,
    exhibitorsVisited: 12,
    eventsAttended: 5,
    connectionsRequested: 8
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Accès non autorisé
          </h3>
          <p className="text-gray-600">
            Veuillez vous connecter pour accéder à votre tableau de bord visiteur
          </p>
          <Link to="/login" className="mt-4 inline-block">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord visiteur
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue {user.name}, gérez vos activités SIPORTS 2026
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">RDV programmés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.appointmentsBooked}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exposants visités</p>
                <p className="text-2xl font-bold text-gray-900">{stats.exhibitorsVisited}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Événements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsAttended}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Network className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connexions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.connectionsRequested}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Prendre un rendez-vous
            </h3>
            <p className="text-gray-600 mb-4">
              Planifiez des rencontres avec les exposants selon leurs disponibilités
            </p>
            <Link to="/networking?action=schedule">
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Programmer un RDV
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
              Messagerie
            </h3>
            <p className="text-gray-600 mb-4">
              Communiquez directement avec les exposants et partenaires
            </p>
            <Link to="/chat">
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ouvrir la messagerie
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            Activité récente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">RDV confirmé avec TechMarine</p>
                  <p className="text-sm text-gray-600">Demain à 14h30 - Stand A12</p>
                </div>
              </div>
              <Badge variant="success">Confirmé</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Nouveau message de PortLogistics</p>
                  <p className="text-sm text-gray-600">Il y a 2 heures</p>
                </div>
              </div>
              <Badge variant="info">Nouveau</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Exposant ajouté aux favoris</p>
                  <p className="text-sm text-gray-600">Maritime Solutions - Il y a 1 jour</p>
                </div>
              </div>
              <Badge variant="warning">Favori</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};