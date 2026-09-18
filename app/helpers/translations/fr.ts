const fr = {
  dashboard: {
    navigation: {
      dashboard: "Tableau de bord",
      reportIssue: "Signaler un problème",
      recentReports: "Rapports récents",
      notifications: "Notifications",
      logout: "Se déconnecter",
    },

    header: {
      title: "Tableau de bord",
      description:
        "Vue d’ensemble des rapports et des activités de la communauté.",
      searchPlaceholder: "Rechercher des rapports...",
    },

    stats: {
      totalReports: "Nombre total de rapports",
      resolved: "Résolus",
      inProgress: "En cours",
      new: "Nouveaux",
      fromLast30Days: "au cours des 30 derniers jours",
    },

    reports: {
      title: "Rapports récents",
      id: "ID",
      reportTitle: "Titre",
      category: "Catégorie",
      location: "Lieu",
      status: "Statut",
      date: "Date",
      actions: "Actions",
      noReports: "Aucun rapport pour le moment",
      reportIssue: "Signaler un problème",
      view: "Voir",
    },

    quickActions: {
      title: "Actions rapides",
      viewAllReports: "Voir tous les rapports",
      exportReport: "Exporter le rapport",
    },

    activity: {
      title: "Activité récente",
    },
  },
  reportIssue: {
    header: {
      title: "Signaler un problème",
      description:
        "Aidez votre communauté en signalant des problèmes ou des préoccupations.",
    },

    steps: {
      issueDetails: "Détails du problème",
      location: "Lieu",
      photos: "Photos (facultatif)",
      review: "Vérification",
    },

    form: {
      issue: "Quel est le problème ?",
      issuePlaceholder:
        "ex. Lampadaire cassé, déchets qui débordent, route endommagée...",
      category: "Catégorie",
      selectCategory: "Sélectionnez une catégorie",
      description: "Description",
      descriptionPlaceholder: "Donnez plus de détails sur le problème...",
      location: "Lieu",
      locationPlaceholder: "Recherchez un lieu ou cliquez sur la carte",
      useMyLocation: "Utiliser ma position",
      addPhoto: "Ajouter une photo",
      optional: "facultatif",
      upload: "Cliquez pour télécharger ou faites glisser un fichier ici",
      fileTypes: "JPG, PNG (5 Mo maximum)",
      submit: "Envoyer le rapport",
    },

    categories: {
      title: "Catégories",

      infrastructure: {
        title: "Infrastructure",
        description: "Routes, ponts, lampadaires, etc.",
      },

      publicSafety: {
        title: "Sécurité publique",
        description: "Criminalité, violence, situations dangereuses",
      },

      sanitation: {
        title: "Assainissement",
        description: "Déchets, drainage, propreté",
      },

      utilities: {
        title: "Services publics",
        description: "Eau, électricité, internet, etc.",
      },

      other: {
        title: "Autre",
        description: "Problèmes généraux ou suggestions",
      },
    },

    safety: {
      title: "Votre sécurité est importante",
      description:
        "Vous pouvez choisir de signaler anonymement le problème si vous ne souhaitez pas partager votre identité.",
    },
  },
  communityIssues: {
    header: {
      title: "Problèmes communautaires",
      description:
        "Découvrez ce qui se passe dans votre région. De vrais problèmes. De vraies mises à jour.",
    },

    stats: {
      totalReports: "Nombre total de rapports",
      resolved: "Résolus",
      inProgress: "En cours",
      new: "Nouveaux",
    },

    filters: {
      all: "Tous",
      mine: "Les miens",
      infrastructure: "Infrastructure",
      publicSafety: "Sécurité publique",
      sanitation: "Assainissement",
      utilities: "Services publics",
      other: "Autre",
    },

    status: {
      resolved: "Résolu",
      inProgress: "En cours",
      new: "Nouveau",
    },

    navigation: {
      logout: "Se déconnecter",
    },

    accessibility: {
      userProfile: "Profil utilisateur",
    },
  },
  notifications: {
    header: {
      title: "Notifications",
      description:
        "Restez informé de l’état de vos rapports et des alertes de la communauté.",
    },

    actions: {
      markAllAsRead: "Tout marquer comme lu",
    },

    filters: {
      all: "Tous",
      unread: "Non lus",
      updates: "Mises à jour",
      comments: "Commentaires",
    },

    unread: "Non lus",

    accessibility: {
      userProfile: "Profil utilisateur",
    },
  },
};

export default fr;
