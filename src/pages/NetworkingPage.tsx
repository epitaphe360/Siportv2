import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Users, Brain, MessageCircle, Calendar, User, Plus, Zap, Search,
  Heart, CheckCircle, Clock, Eye, BarChart3, TrendingUp
} from 'lucide-react';

import { useNetworkingStore } from '@/store/networkingStore';
import useAuthStore from '@/store/authStore';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

export default function NetworkingPage() {
  const { user, isAuthenticated } = useAuthStore();
  const {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    connections,
    favorites,
    pendingConnections,
    aiInsights,
    showAppointmentModal,
    selectedExhibitorForRDV,
    selectedTimeSlot,
    appointmentMessage,
    generateRecommendations,
    addToFavorites,
    removeFromFavorites,
  handleConnect,
  handleMessage,
  loadAIInsights,
    setShowAppointmentModal,
    setSelectedExhibitorForRDV,
    setSelectedTimeSlot,
    setAppointmentMessage,
  } = useNetworkingStore();

  const [activeTab, setActiveTab] = React.useState<'recommendations' | 'search' | 'connections' | 'insights'>('recommendations');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetchRecommendations();
    }
  }, [isAuthenticated, user, fetchRecommendations]);

  const handleSearch = () => {
    toast.success(`Recherche lancée pour "${searchTerm}"...`);
    // Mock search results
    setSearchResults(recommendations.slice(0, 3));
  };

  const handleViewProfile = (userName: string, company: string) => {
    toast.info(`Affichage du profil de ${userName} (${company})`);
  };

  const handleBookAppointment = (profile: any) => {
    if (!isAuthenticated) {
      toast.error('Connexion requise pour prendre rendez-vous');
      window.location.href = '/login?redirect=/networking?action=book_appointment';
      return;
    }
    setSelectedExhibitorForRDV(profile);
    setShowAppointmentModal(true);
  };

  const handleConfirmAppointment = () => {
    if (!selectedTimeSlot) {
      toast.error('Veuillez sélectionner un créneau horaire');
      return;
    }
    const appointmentData = {
      exhibitor: `${selectedExhibitorForRDV.profile.firstName} ${selectedExhibitorForRDV.profile.lastName}`,
      timeSlot: selectedTimeSlot,
      message: appointmentMessage,
      confirmationId: `RDV-${Date.now()}`
    };
    toast.success(`Demande de RDV envoyée à ${appointmentData.exhibitor} — ${appointmentData.timeSlot}`);
    setShowAppointmentModal(false);
    setSelectedExhibitorForRDV(null);
    setSelectedTimeSlot('');
    setAppointmentMessage('');
  };

  const handleFavoriteToggle = (userId: string, userName: string, isFavorite: boolean) => {
    if (isFavorite) {
      removeFromFavorites(userId);
      toast.success(`Retiré des favoris : ${userName}`);
    } else {
      addToFavorites(userId);
      toast.success(`Ajouté aux favoris : ${userName}`);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur notre plateforme</h1>
            <p className="text-gray-600 mb-4">
              Connectez-vous pour découvrir des opportunités de réseautage personnalisées
            </p>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg">
                <User className="h-4 w-4 mr-2" />
                Se Connecter
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Créer un Compte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-gray-900">Réseautage Intelligent</h1>
            <p className="text-md text-gray-600 mt-1">
              Connectez-vous avec les bonnes personnes grâce à notre intelligence artificielle de matching
            </p>
          </motion.div>
          <div className="flex justify-center mt-4">
            <nav className="flex space-x-8">
              {[
                { id: 'recommendations', label: 'Recommandations IA', icon: Brain },
                { id: 'search', label: 'Recherche Avancée', icon: Search },
                { id: 'connections', label: 'Mes Connexions', icon: Users },
                { id: 'insights', label: 'Insights IA', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'recommendations' | 'search' | 'connections' | 'insights')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'recommendations' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {isLoading ? (
              <p>Chargement des recommandations...</p>
            ) : error ? (
              <p>Erreur: {error}</p>
            ) : recommendations.length === 0 ? (
              <Card className="text-center p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Activez l'IA pour votre réseau</h3>
                <p className="text-gray-600 mb-4">
                  Notre IA analyse votre profil pour trouver les meilleurs contacts
                </p>
                <Button 
                  onClick={() => {
                    if (user) {
                      generateRecommendations(user.id);
                      toast.success('IA activée, recommandations générées !');
                    }
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Générer les Recommandations
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec) => {
                  const profile = rec.recommendedUser;
                  const isFavorite = favorites.includes(profile.id);
                  const isConnected = connections.includes(profile.id);
                  const isPending = pendingConnections.includes(profile.id);

                  return (
                    <Card key={profile.id} className="p-4 flex flex-col">
                      <div className="flex items-start">
                        <Avatar className="h-16 w-16 mr-4">
                          <AvatarImage src={profile.profile.avatar} alt={`${profile.profile.firstName} ${profile.profile.lastName}`} />
                          <AvatarFallback>{profile.profile.firstName[0]}{profile.profile.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{`${profile.profile.firstName} ${profile.profile.lastName}`}</h4>
                          <p className="text-sm text-gray-600">{profile.profile.position}</p>
                          <p className="text-sm text-gray-500">{profile.profile.company}</p>
                        </div>
                        <Badge variant="default" className={getCompatibilityColor(rec.score)}>
                          {getCompatibilityLabel(rec.score)} {rec.score}%
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 italic">"{rec.reasons[0]}"</p>
                      </div>
                      <div className="mt-4 flex-grow">
                        <h5 className="text-xs font-semibold uppercase text-gray-400 mb-2">Intérêts communs</h5>
                        <div className="flex flex-wrap gap-1">
                          {profile.profile.interests.slice(0, 3).map(interest => (
                            <Badge key={interest} variant="default">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2">
                          {isConnected ? (
                            <Button size="sm" variant="outline" disabled>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connecté
                            </Button>
                          ) : isPending ? (
                            <Button size="sm" variant="outline" disabled>
                              <Clock className="h-3 w-3 mr-1" />
                              En attente
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => handleConnect(profile.id, `${profile.profile.firstName} ${profile.profile.lastName}`)}
                            >
                              <Users className="h-3 w-3 mr-1" />
                              Connecter
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBookAppointment(profile)}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            RDV
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                           <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMessage(`${profile.profile.firstName} ${profile.profile.lastName}`, profile.profile.company || '')}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleFavoriteToggle(profile.id, `${profile.profile.firstName} ${profile.profile.lastName}`, isFavorite)}
                          >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewProfile(`${profile.profile.firstName} ${profile.profile.lastName}`, profile.profile.company || '')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
        
        {activeTab === 'search' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Technologies, secteurs..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end md:col-span-4">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
             {searchResults.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Résultats de la recherche ({searchResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Render search results similar to recommendations */}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'connections' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Mes Connexions ({connections.length})
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.success(`Statistiques — Total: ${connections.length}`)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistiques
              </Button>
            </div>
            {/* Render connections list */}
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Insights IA</h2>
              <p className="text-gray-600 mb-4">
                L'IA analyse vos données pour générer des insights personnalisés
              </p>
              <Button onClick={loadAIInsights}>
                <Zap className="h-4 w-4 mr-2" />
                Générer les Insights
              </Button>
            </div>
            {aiInsights && (
              <Card className="p-6">
                <h3 className="font-bold mb-2">{aiInsights.summary}</h3>
                <ul>
                  {aiInsights.suggestions.map((s: string) => <li key={s}>{s}</li>)}
                </ul>
              </Card>
            )}
          </motion.div>
        )}
      </div>

      {showAppointmentModal && selectedExhibitorForRDV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Prendre RDV avec {selectedExhibitorForRDV.profile.firstName}
            </h3>
            {/* Time slot selection and message input would go here */}
            <div className="flex space-x-3">
              <Button 
                onClick={handleConfirmAppointment}
                className="flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Envoyer la Demande
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowAppointmentModal(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};