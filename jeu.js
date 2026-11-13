// Logique de Récif de Néon : état, entrées, règles et boucle du jeu.
// Les éléments de la page.
const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");
const scene = document.getElementById("scene");
const ecranTitre = document.getElementById("ecran-titre");
const ecranFin = document.getElementById("ecran-fin");
const elementScore = document.getElementById("score");
const elementNiveau = document.getElementById("niveau");
const elementProgressionVague = document.getElementById("vague-progression");
const elementChronoFrenesie = document.getElementById("chrono-frenesie");
const elementCombo = document.getElementById("combo");
const elementComboValeur = document.getElementById("combo-valeur");
const elementComboJauge = document.getElementById("combo-jauge");
const elementVies = document.getElementById("vies").getElementsByTagName("i");
const elementViesLabel = document.getElementById("vies-label");
const elementBouclier = document.getElementById("bouclier");
const elementAimant = document.getElementById("aimant");
const elementEvenementVague = document.getElementById("evenement-vague");
const alerteBoss = document.getElementById("alerte-boss");
const barreBoss = alerteBoss.querySelector("b");
const boutonSon = document.getElementById("bouton-son");
const boutonJouer = document.getElementById("bouton-jouer");
const boutonFrenesie = document.getElementById("bouton-frenesie");
const boutonRejouer = document.getElementById("bouton-rejouer");
const recordTitre = document.getElementById("record-titre");
const recordFrenesieTitre = document.getElementById("record-frenesie-titre");
const finScore = document.getElementById("fin-score");
const finRecord = document.getElementById("fin-record");
const finMode = document.getElementById("fin-mode");
const badgeRecord = document.getElementById("badge-record");
const boutonsTheme = document.querySelectorAll(".bouton-theme");
// L'état de la partie.
let etat = "titre";
let score = 0; 
let cristaux = 0;
let record = 0;
let vies = REGLAGES.viesDepart;
let niveau = 1;
let vague = 1;
let tempsJeu = 0;
let chronoEvenementVague = 0;
let modeFrenesie = false;
let chronoFrenesie = 0;
let recordFrenesie = 0;
let boss = null;
let prochainBoss = REGLAGES.intervalleBoss;
let combo = 0;
let chronoCombo = 0;
let chronoGlace = 0;
let bouclierActif = false;
let chronoAimant = 0;
let objets = [];
let chronoSpawn = 0;
let dernierTemps = 0;
let panier = { x: LARGEUR / 2 - REGLAGES.largeurPanier / 2, y: HAUTEUR - 74, largeur: REGLAGES.largeurPanier, hauteur: REGLAGES.hauteurPanier, vitesse: 0, cibleX: null };
let touches = {};
const CLE_THEME = "recifDeNeonTheme";
// Record, multiplicateur et affichage du HUD.
function appliquerTheme(nom) {
  const theme = THEMES[nom] || THEMES.neon;
  Object.assign(COULEURS, theme.canvas);
  for (const [variable, valeur] of Object.entries(theme.css)) {
    document.documentElement.style.setProperty("--" + variable, valeur);
  }
  for (const bouton of boutonsTheme) {
    bouton.classList.toggle("actif", bouton.dataset.theme === (THEMES[nom] ? nom : "neon"));
  }
  try { localStorage.setItem(CLE_THEME, THEMES[nom] ? nom : "neon"); } catch (erreur) {}
}
function chargerTheme() {
  try { return localStorage.getItem(CLE_THEME) || "neon"; } catch (erreur) { return "neon"; }
}
function lireRecord() {
  try { return parseInt(localStorage.getItem(CLE_RECORD), 10) || 0; } catch (erreur) { return 0; }
}
function ecrireRecord() {
  try { localStorage.setItem(CLE_RECORD, String(record)); } catch (erreur) {}
}
function lireRecordFrenesie() {
  try { return parseInt(localStorage.getItem("recifDeNeonRecordFrenesie"), 10) || 0; } catch (erreur) { return 0; }
}
function ecrireRecordFrenesie() {
  try { localStorage.setItem("recifDeNeonRecordFrenesie", String(recordFrenesie)); } catch (erreur) {}
}
function multiplicateur() {
  return Math.min(REGLAGES.multiplicateurMax, 1 + Math.floor(combo / 3));
}
function majHud() {
  elementScore.textContent = score;
  elementNiveau.textContent = modeFrenesie ? "FRÉNÉSIE" : "VAGUE " + vague;
  elementViesLabel.textContent = modeFrenesie ? "TEMPS" : "VIES";
  elementProgressionVague.style.transform = "scaleX(" + (modeFrenesie ? Math.max(0, chronoFrenesie / REGLAGES.dureeFrenesie) : Math.max(0, (tempsJeu % REGLAGES.dureeVague) / REGLAGES.dureeVague)) + ")";
  elementChronoFrenesie.textContent = modeFrenesie ? Math.ceil(chronoFrenesie) + " S" : "";
  elementChronoFrenesie.classList.toggle("actif", modeFrenesie);
  elementComboValeur.textContent = "x" + multiplicateur();
  elementCombo.classList.toggle("fort", multiplicateur() > 1);
  for (let i = 0; i < elementVies.length; i++) {
    elementVies[i].classList.toggle("perdue", i >= vies);
  }
  elementComboJauge.style.transform = "scaleX(" + Math.max(0, chronoCombo / REGLAGES.dureeCombo) + ")";
  elementBouclier.textContent = bouclierActif ? "BOUCLIER : ACTIF" : "BOUCLIER : INACTIF";
  elementBouclier.classList.toggle("actif", bouclierActif);
  elementAimant.textContent = chronoAimant > 0 ? "AIMANT : " + Math.ceil(chronoAimant) + " S" : "AIMANT : INACTIF";
  elementAimant.classList.toggle("actif", chronoAimant > 0);
  elementEvenementVague.textContent = chronoEvenementVague > 0 ? "COURANT MARIN" : "";
  elementEvenementVague.classList.toggle("actif", chronoEvenementVague > 0);
  alerteBoss.classList.toggle("actif", boss !== null);
  barreBoss.style.transform = "scaleX(" + (boss ? Math.max(0, boss.temps / REGLAGES.dureeBoss) : 0) + ")";
}
// Lancer, terminer et recommencer une partie.
function demarrerPartie(frenesie) {
  preparerAudio();
  etat = "jeu";
  modeFrenesie = Boolean(frenesie);
  scene.dataset.mode = modeFrenesie ? "frenesie" : "normal";
  chronoFrenesie = modeFrenesie ? REGLAGES.dureeFrenesie : 0;
  score = 0; vies = REGLAGES.viesDepart; niveau = 1; tempsJeu = 0;
  vague = 1; chronoEvenementVague = 0;
  boss = null; prochainBoss = REGLAGES.intervalleBoss;
  cristaux = 0;
  combo = 0; chronoCombo = 0; chronoGlace = 0; chronoAimant = 0; bouclierActif = false; objets = []; chronoSpawn = 0.45;
  panier.x = LARGEUR / 2 - panier.largeur / 2; panier.cibleX = null; panier.vitesse = 0;
  ecranTitre.classList.add("cache");
  ecranFin.classList.add("cache");
  scene.dataset.etat = "jeu";
  majHud();
  sonClic();
}
function terminerPartie() {
  etat = "fin";
  const meilleurScore = modeFrenesie ? recordFrenesie : record;
  const nouveauRecord = score > meilleurScore;
  if (nouveauRecord) {
    if (modeFrenesie) { recordFrenesie = score; ecrireRecordFrenesie(); }
    else { record = score; ecrireRecord(); }
  }
  creerParticules(panier.x + panier.largeur / 2, panier.y, COULEURS.cyan, 26, 280);
  secouer(20);
  flasher(COULEURS.blanc, 0.4);
  finScore.textContent = score;
  // AFFICHER LE NOMBRE DE CRISTAUX ATTRAPÉS SUR L'ÉCRAN DE FIN DANS finScore 
  finScore.textContent += " | CRISTAUX : " + cristaux;
  finRecord.textContent = modeFrenesie ? recordFrenesie : record;
  finMode.textContent = modeFrenesie ? "RECORD FRÉNÉSIE" : "RECORD";
  elementNiveau.textContent = modeFrenesie ? "FRÉNÉSIE TERMINÉE" : "VAGUE " + vague;
  badgeRecord.classList.toggle("cache", !nouveauRecord);
  scene.dataset.etat = "fin";
  ecranFin.classList.remove("cache");
  if (nouveauRecord) setTimeout(sonRecord, 250);
}
// Créer les objets et régler la difficulté.
function creerObjet() {
  const tirage = Math.random();
  let type = CRISTAL;
  const hasardBombe = Math.min(0.42, REGLAGES.hasardBombe + (niveau - 1) * 0.03);
  if (tirage < hasardBombe) type = BOMBE;
  else if (tirage < hasardBombe + REGLAGES.hasardGlace) type = GLACE;
  else if (tirage < hasardBombe + REGLAGES.hasardGlace + REGLAGES.hasardBouclier) type = BOUCLIER;
  else if (tirage < hasardBombe + REGLAGES.hasardGlace + REGLAGES.hasardBouclier + REGLAGES.hasardAimant) type = AIMANT;
  else if (tirage > 1 - REGLAGES.hasardDore) type = DORE;
  const rayon = type === DORE ? 17 : type === BOMBE ? 15 : type === GLACE ? 16 : type === BOUCLIER ? 17 : type === AIMANT ? 16 : 13;
  const vitesse = Math.min(REGLAGES.vitesseChuteMax, REGLAGES.vitesseChute + (niveau - 1) * 28);
  objets.push({
    type: type, x: hasard(rayon + 12, LARGEUR - rayon - 12), y: -rayon - 8, rayon: rayon,
    vitesse: vitesse * hasard(0.85, 1.15), rotation: Math.random() * 6.28,
    vitesseRotation: hasard(-2.2, 2.2), pulsation: Math.random() * 10
  });
}
function creerBombeBoss() {
  const rayon = 15;
  objets.push({
    type: BOMBE, x: boss.x + hasard(-34, 34), y: boss.y + 32, rayon: rayon,
    vitesse: Math.min(REGLAGES.vitesseChuteMax, REGLAGES.vitesseChute + (niveau - 1) * 28) * 1.1,
    rotation: Math.random() * 6.28, vitesseRotation: hasard(-2.2, 2.2), pulsation: Math.random() * 10
  });
}
function lancerBoss() {
  boss = { x: LARGEUR * 0.2, y: 82, direction: 1, temps: 0, chronoBombe: 0 };
  sonBoss();
  flasher(COULEURS.magenta, 0.2);
  ajouterTexte(LARGEUR / 2, HAUTEUR * 0.3, "LE BRISEUR ARRIVE", COULEURS.magenta);
}
function mettreAJourBoss(dt) {
  if (!boss) {
    if (tempsJeu >= prochainBoss) {
      lancerBoss();
      prochainBoss += REGLAGES.intervalleBoss;
    }
    return;
  }
  boss.temps += dt;
  boss.x += boss.direction * 150 * dt;
  if (boss.x < 72 || boss.x > LARGEUR - 72) boss.direction *= -1;
  boss.chronoBombe -= dt;
  if (boss.chronoBombe <= 0) {
    creerBombeBoss();
    boss.chronoBombe = REGLAGES.intervalleBombesBoss;
  }
  if (boss.temps >= REGLAGES.dureeBoss) {
    ajouterTexte(boss.x, boss.y, "BRISEUR ÉLOIGNÉ", COULEURS.cyan);
    boss = null;
  }
}
function majPanier(dt) {
  const direction = (touches.ArrowRight || touches.KeyD ? 1 : 0) - (touches.ArrowLeft || touches.KeyA ? 1 : 0);
  const avant = panier.x;
  if (direction !== 0) {
    panier.x += direction * REGLAGES.vitessePanier * dt;
    panier.cibleX = panier.x + panier.largeur / 2;
  } else if (panier.cibleX !== null) {
    panier.x += (panier.cibleX - panier.largeur / 2 - panier.x) * Math.min(1, dt * 16);
  }
  panier.x = Math.max(REGLAGES.margePanier, Math.min(LARGEUR - panier.largeur - REGLAGES.margePanier, panier.x));
  panier.vitesse = (panier.x - avant) / Math.max(dt, 0.001);
}
function estAttrape(objet) {
  return objet.y + objet.rayon >= panier.y &&
    objet.y - objet.rayon <= panier.y + panier.hauteur &&
    objet.x + objet.rayon * 0.5 >= panier.x &&
    objet.x - objet.rayon * 0.5 <= panier.x + panier.largeur;
}
function toucherObjet(objet) {
  // compte les cristaux attrapés dans la variable cristaux
  if (objet.type === CRISTAL || objet.type === GLACE || objet.type === BOUCLIER) { cristaux += 1; }


  if (objet.type === BOMBE) {
    creerParticules(objet.x, objet.y, COULEURS.magenta, 28, 320);
    if (modeFrenesie) {
      chronoFrenesie = Math.max(0, chronoFrenesie - REGLAGES.penaliteBombeFrenesie);
      ajouterTexte(objet.x, objet.y - 10, "-3 S", COULEURS.rouge);
      sonBombe();
      return;
    }
    if (bouclierActif) {
      bouclierActif = false;
      creerParticules(objet.x, objet.y, COULEURS.bouclier, 30, 320);
      ajouterTexte(objet.x, objet.y - 10, "BOUCLIER", COULEURS.bouclier);
      sonCristal(1);
      return;
    }
    perdreVie(objet.x, objet.y, true);
    return;
  }
  if (objet.type === GLACE) {
    chronoGlace = REGLAGES.dureeGlace;
  }
  if (objet.type === BOUCLIER) {
    bouclierActif = true;
  }
  if (objet.type === AIMANT) {
    chronoAimant = REGLAGES.dureeAimant;
  }
  combo += 1;
  chronoCombo = REGLAGES.dureeCombo;
  const multi = multiplicateur();
  const points = (objet.type === DORE ? 50 : 10) * multi * (modeFrenesie ? 2 : 1);
  const couleur = objet.type === DORE ? COULEURS.or : objet.type === GLACE ? COULEURS.glace : objet.type === BOUCLIER ? COULEURS.bouclier : objet.type === AIMANT ? COULEURS.cyan : COULEURS.cyan;
  score += points;
  creerParticules(objet.x, objet.y, couleur, objet.type === DORE || objet.type === GLACE || objet.type === BOUCLIER ? 24 : 14, 280);
  ajouterTexte(objet.x, objet.y - 10, "+" + points, couleur);
  if (objet.type === DORE) { sonDore(); flasher(COULEURS.or, 0.18); }
  else { sonCristal(multi); flasher(couleur, objet.type === GLACE || objet.type === BOUCLIER ? 0.12 : 0.06); }
  secouer(3);
}
function perdreVie(x, y, bombe) {
  if (modeFrenesie) {
    chronoFrenesie = Math.max(0, chronoFrenesie - REGLAGES.penaliteBombeFrenesie);
    ajouterTexte(x, y - 28, "-3 S", COULEURS.rouge);
    if (bombe) sonBombe();
    return;
  }
  vies -= 1;
  combo = 0;
  chronoCombo = 0;
  creerParticules(x, y, COULEURS.rouge, 24, 260);
  secouer(12);
  flasher(COULEURS.rouge, 0.3);
  ajouterTexte(panier.x + panier.largeur / 2, panier.y - 28, "-1 VIE", COULEURS.rouge);
  if (bombe) sonBombe();
  else sonPerte();
  if (vies <= 0) terminerPartie();
}
// Mise à jour de la partie à chaque image.
function mettreAJour(dt) {
  mettreAJourEffets(dt);
  if (etat !== "jeu") return;

  tempsJeu += dt;
  if (modeFrenesie) {
    chronoFrenesie -= dt;
    if (chronoFrenesie <= 0) {
      chronoFrenesie = 0;
      terminerPartie();
      return;
    }
  }
  const nouvelleVague = 1 + Math.floor(tempsJeu / REGLAGES.dureeVague);
  if (!modeFrenesie && nouvelleVague > vague) {
    vague = nouvelleVague;
    niveau = vague;
    flasher(COULEURS.cyan, 0.15);
    sonVague();
    creerParticules(LARGEUR / 2, HAUTEUR * 0.35, COULEURS.cyan, 18, 180);
    ajouterTexte(LARGEUR / 2, HAUTEUR * 0.36, "NOUVELLE VAGUE", COULEURS.cyan);
    if (vague % 5 === 0) {
      chronoEvenementVague = REGLAGES.dureeEvenementVague;
      sonEvenementVague();
      flasher(COULEURS.magenta, 0.12);
      ajouterTexte(LARGEUR / 2, HAUTEUR * 0.43, "COURANT MARIN", COULEURS.magenta);
    }
  }
  if (chronoCombo > 0) {
    chronoCombo -= dt;
    if (chronoCombo <= 0) { chronoCombo = 0; combo = 0; }
  }
  if (chronoGlace > 0) chronoGlace = Math.max(0, chronoGlace - dt);
  if (chronoAimant > 0) chronoAimant = Math.max(0, chronoAimant - dt);
  if (chronoEvenementVague > 0) chronoEvenementVague = Math.max(0, chronoEvenementVague - dt);
  majPanier(dt);
  if (!modeFrenesie) mettreAJourBoss(dt);
  chronoSpawn -= dt;
  if (chronoSpawn <= 0) {
    creerObjet();
    const intervalleVague = Math.max(REGLAGES.intervalleMin, REGLAGES.intervalleObjet - (vague - 1) * 0.075);
    const facteurEvenement = chronoEvenementVague > 0 ? REGLAGES.facteurEvenementVague : 1;
    const facteurFrenesie = modeFrenesie ? REGLAGES.facteurSpawnFrenesie : 1;
    chronoSpawn = intervalleVague * facteurEvenement * facteurFrenesie * hasard(0.8, 1.15);
  }
  for (let i = objets.length - 1; i >= 0; i--) {
    const objet = objets[i];
    const facteurVitesse = chronoGlace > 0 ? REGLAGES.facteurGlace : 1;
    objet.y += objet.vitesse * facteurVitesse * dt;
    objet.rotation += objet.vitesseRotation * facteurVitesse * dt;
    if (chronoAimant > 0 && [CRISTAL, DORE, GLACE].includes(objet.type)) {
      const centrePanier = panier.x + panier.largeur / 2;
      if (Math.abs(centrePanier - objet.x) <= REGLAGES.rayonAimant) {
        objet.x += (centrePanier - objet.x) * Math.min(1, dt * 5);
      }
    }
    if (objet.type === DORE && Math.random() < dt * 18) {
      creerParticules(objet.x, objet.y, COULEURS.or, 1, 30);
    }
    if (estAttrape(objet)) {
      objets.splice(i, 1);
      toucherObjet(objet);
    } else if (objet.y - objet.rayon > HAUTEUR + 20) {
      objets.splice(i, 1);
      if (objet.type === CRISTAL) perdreVie(objet.x, HAUTEUR - 30, false);
      else if (objet.type === DORE) ajouterTexte(objet.x, HAUTEUR - 40, "CRISTAL DORÉ PERDU", COULEURS.or);
    }
  }
  majHud();
}
// Dessin de la scène.
function dessiner() {
  ctx.clearRect(0, 0, LARGEUR, HAUTEUR);
  const temps = performance.now() / 1000;
  dessinerFond(ctx, temps);
  ctx.save();
  if (forceSecousse > 0) {
    ctx.translate(hasard(-forceSecousse, forceSecousse), hasard(-forceSecousse, forceSecousse));
  }
  if (etat !== "titre") {
    if (boss) dessinerBoss(ctx, boss, temps);
    dessinerPanier(ctx, panier, temps);
    for (const objet of objets) dessinerObjet(ctx, objet, temps);
  }
  dessinerEffets(ctx);
  ctx.restore();
  dessinerFlash(ctx);
}
function positionX(evenement) {
  const zone = canvas.getBoundingClientRect();
  return Math.max(0, Math.min(LARGEUR, (evenement.clientX - zone.left) * (LARGEUR / zone.width)));
}
// Entrées clavier, souris et doigt.
window.addEventListener("keydown", function (evenement) {
  const code = evenement.code;
  if (["ArrowLeft", "ArrowRight", "Space", "KeyA", "KeyD", "Enter"].includes(code)) evenement.preventDefault();
  touches[code] = true;
  preparerAudio();
  if ((code === "Space" || code === "Enter") && etat !== "jeu") demarrerPartie();
});
window.addEventListener("keyup", function (evenement) { touches[evenement.code] = false; });
window.addEventListener("blur", function () { touches = {}; });
canvas.addEventListener("pointermove", function (evenement) {
  panier.cibleX = positionX(evenement);
  if (etat === "jeu") preparerAudio();
});
canvas.addEventListener("pointerdown", function (evenement) {
  preparerAudio();
  panier.cibleX = positionX(evenement);
  if (canvas.setPointerCapture) canvas.setPointerCapture(evenement.pointerId);
});
boutonJouer.addEventListener("click", function () { demarrerPartie(false); });
boutonFrenesie.addEventListener("click", function () { demarrerPartie(true); });
boutonRejouer.addEventListener("click", function () { demarrerPartie(modeFrenesie); });
document.getElementById("bouton-menu").addEventListener("click", function () { location.reload(); });
boutonSon.addEventListener("click", function () {
  basculerSon();
  boutonSon.textContent = sonActif ? "SON ACTIF" : "SON COUPÉ";
  boutonSon.setAttribute("aria-pressed", sonActif ? "true" : "false");
  if (sonActif) sonClic();
});
for (const bouton of boutonsTheme) {
  bouton.addEventListener("click", function () {
    appliquerTheme(bouton.dataset.theme);
    preparerAudio();
    sonClic();
  });
}
// La boucle du jeu.
function boucle(horodatage) {
  const dt = Math.min((horodatage - dernierTemps) / 1000, 0.033);
  dernierTemps = horodatage;
  mettreAJour(dt);
  dessiner();
  requestAnimationFrame(boucle);
}

record = lireRecord();
recordFrenesie = lireRecordFrenesie();
appliquerTheme(chargerTheme());
recordTitre.textContent = record;
recordFrenesieTitre.textContent = recordFrenesie;
majHud();
requestAnimationFrame(boucle);
