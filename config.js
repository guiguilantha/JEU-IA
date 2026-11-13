// Réglages de Récif de Néon — thème récif corallien aquatique.
// Modifie ces valeurs pour équilibrer le jeu sans toucher au reste du code.

const LARGEUR = 480; // largeur logique du canvas
const HAUTEUR = 720; // hauteur logique du canvas

// Types d'objets qui tombent.
const CRISTAL = "cristal";
const BOMBE = "bombe";
const DORE = "dore";
const GLACE = "glace";
const BOUCLIER = "bouclier";
const AIMANT = "aimant";

const COULEURS = {
  fond: "#04283d",
  cyan: "#28f0ff",
  glace: "#9eeeff",
  bouclier: "#9b7cff",
  magenta: "#ff6f91",
  or: "#ffd166",
  rouge: "#ff4d6d",
  blanc: "#eaf9ff",
  grille: "rgba(77, 216, 255, 0.14)"
};

const THEMES = {
  neon: {
    nom: "NÉON",
    css: { fond: "#04141f", cyan: "#28f0ff", magenta: "#ff6f91", or: "#ffd166", blanc: "#eaf9ff", gris: "#6fa8c2" },
    canvas: { fond: "#04283d", cyan: "#28f0ff", magenta: "#ff6f91", or: "#ffd166", blanc: "#eaf9ff", grille: "rgba(77, 216, 255, 0.14)" }
  },
  lagon: {
    nom: "LAGON",
    css: { fond: "#071d26", cyan: "#69f0c2", magenta: "#f6a65b", or: "#f5d76e", blanc: "#effff8", gris: "#78bcae" },
    canvas: { fond: "#073b42", cyan: "#69f0c2", magenta: "#f6a65b", or: "#f5d76e", blanc: "#effff8", grille: "rgba(105, 240, 194, 0.14)" }
  },
  abysses: {
    nom: "ABYSSES",
    css: { fond: "#100d29", cyan: "#a48bff", magenta: "#ff70c8", or: "#f2c46d", blanc: "#f5efff", gris: "#938bb8" },
    canvas: { fond: "#171443", cyan: "#a48bff", magenta: "#ff70c8", or: "#f2c46d", blanc: "#f5efff", grille: "rgba(164, 139, 255, 0.14)" }
  }
};

const REGLAGES = {
  viesDepart: 3,
  vitessePanier: 560,    // pixels par seconde au clavier
  vitesseChute: 145,     // vitesse du premier niveau
  vitesseChuteMax: 430,
  intervalleObjet: 0.95, // secondes entre deux objets
  intervalleMin: 0.34,
  dureeVague: 20,        // secondes par vague
  dureeEvenementVague: 8,
  facteurEvenementVague: 0.55,
  intervalleBoss: 45,
  dureeBoss: 8,
  intervalleBombesBoss: 0.8,
  dureeCombo: 3,         // secondes pour enchaîner
  multiplicateurMax: 5,
  hasardBombe: 0.14,
  hasardDore: 0.05,
  hasardGlace: 0.03,
  hasardBouclier: 0.02,
  hasardAimant: 0.02,
  dureeGlace: 4,
  facteurGlace: 0.5,
  dureeAimant: 6,
  rayonAimant: 120,
  dureeFrenesie: 30,
  facteurSpawnFrenesie: 0.5,
  penaliteBombeFrenesie: 3,
  largeurPanier: 96,
  hauteurPanier: 16,
  margePanier: 12
};

const CLE_RECORD = "pluieDeNeonRecord";
