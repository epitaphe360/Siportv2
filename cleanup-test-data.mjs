import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Configuration Supabase manquante');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupTestData() {
  console.log('🧹 Nettoyage des données de test...\n');

  try {
    // Supprimer dans l'ordre inverse des dépendances

    // 1. Supprimer les mini-sites
    console.log('🗑️ Suppression des mini-sites...');
    const { error: miniSitesError } = await supabase
      .from('mini_sites')
      .delete()
      .in('id', ['880e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002']);

    if (miniSitesError) {
      console.error('❌ Erreur suppression mini-sites:', miniSitesError.message);
    } else {
      console.log('✅ Mini-sites supprimés');
    }

    // 2. Supprimer les événements
    console.log('🗑️ Suppression des événements...');
    const { error: eventsError } = await supabase
      .from('events')
      .delete()
      .in('id', ['770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002']);

    if (eventsError) {
      console.error('❌ Erreur suppression événements:', eventsError.message);
    } else {
      console.log('✅ Événements supprimés');
    }

    // 3. Supprimer les exposants
    console.log('🗑️ Suppression des exposants...');
    const { error: exhibitorsError } = await supabase
      .from('exhibitors')
      .delete()
      .in('id', ['660e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002']);

    if (exhibitorsError) {
      console.error('❌ Erreur suppression exposants:', exhibitorsError.message);
    } else {
      console.log('✅ Exposants supprimés');
    }

    // 4. Supprimer les utilisateurs (attention: cela peut casser d'autres choses)
    console.log('⚠️ Suppression des utilisateurs de test...');
    const testEmails = [
      'admin@siports.com',
      'exhibitor1@test.com',
      'exhibitor2@test.com',
      'partner@test.com',
      'visitor1@test.com',
      'visitor2@test.com'
    ];

    for (const email of testEmails) {
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('email', email);

      if (userError) {
        console.error(`❌ Erreur suppression utilisateur ${email}:`, userError.message);
      } else {
        console.log(`✅ Utilisateur supprimé: ${email}`);
      }
    }

    console.log('\n🎉 Nettoyage terminé!');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Demander confirmation avant de supprimer
console.log('⚠️ ATTENTION: Ce script va supprimer TOUTES les données de test!');
console.log('Êtes-vous sûr de vouloir continuer? (modifiez le script pour exécuter cleanupTestData())');

// cleanupTestData(); // Décommenter pour exécuter
