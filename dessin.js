// Dessin du décor, de la pieuvre et des objets. Thème : récif corallien sous-marin.

const bulles = [];
for (let i = 0; i < 46; i++) {
  bulles.push({
    x: Math.random() * LARGEUR,
    decalage: Math.random() * (HAUTEUR + 40),
    rayon: 1.5 + Math.random() * 3.5,
    vitesse: 14 + Math.random() * 30,
    derive: Math.random() * 6.28,
    phase: Math.random() * 6.28
  });
}

const poissonsFond = [];
for (let i = 0; i < 7; i++) {
  poissonsFond.push({
    y: 40 + Math.random() * (HAUTEUR * 0.5),
    taille: 10 + Math.random() * 14,
    vitesse: 18 + Math.random() * 26,
    sens: Math.random() < 0.5 ? 1 : -1,
    decalage: Math.random() * LARGEUR,
    phase: Math.random() * 6.28,
    teinte: Math.random() < 0.5 ? "rgba(77, 216, 255, 0.4)" : "rgba(255, 209, 102, 0.32)"
  });
}

function dessinerFond(ctx, temps) {
  // Dégradé de la surface éclairée vers les profondeurs sombres.
  const degrade = ctx.createLinearGradient(0, 0, 0, HAUTEUR);
  degrade.addColorStop(0, "#0b3c57");
  degrade.addColorStop(0.45, COULEURS.fond);
  degrade.addColorStop(1, "#010a14");
  ctx.fillStyle = degrade;
  ctx.fillRect(0, 0, LARGEUR, HAUTEUR);

  // Lueur de surface, près du haut de l'écran.
  const surface = HAUTEUR * 0.12;
  const halo = ctx.createRadialGradient(LARGEUR / 2, 0, 4, LARGEUR / 2, surface, LARGEUR * 0.9);
  halo.addColorStop(0, "rgba(180, 240, 255, 0.28)");
  halo.addColorStop(0.5, "rgba(77, 216, 255, 0.08)");
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, LARGEUR, HAUTEUR);

  // Ondulations de lumière diffuse qui traversent l'eau.
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "rgba(151, 231, 245, 0.45)";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(77, 216, 255, 0.35)";
  ctx.shadowBlur = 18;
  for (let i = 0; i < 4; i++) {
    const baseX = 56 + i * 130;
    const ondulation = Math.sin(temps * 0.55 + i * 1.7) * 20;
    ctx.beginPath();
    ctx.moveTo(baseX - 28, HAUTEUR * 0.08);
    ctx.bezierCurveTo(
      baseX + ondulation, HAUTEUR * 0.2,
      baseX - ondulation, HAUTEUR * 0.38,
      baseX + ondulation * 0.6, HAUTEUR * 0.58
    );
    ctx.stroke();
  }
  ctx.restore();

  // Récif corallien et algues au fond de l'écran.
  const solY = HAUTEUR - 46;
  ctx.save();
  for (let i = 0; i < 9; i++) {
    const x = i * 58 - 10;
    const hauteurAlgue = 60 + (i * 37) % 90;
    const balancement = Math.sin(temps * 1.4 + i) * 10;
    ctx.strokeStyle = i % 2 ? "rgba(46, 196, 143, 0.55)" : "rgba(33, 150, 115, 0.5)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, solY + 10);
    ctx.quadraticCurveTo(x + balancement, solY - hauteurAlgue * 0.5, x + balancement * 1.6, solY - hauteurAlgue);
    ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    const x = i * 86 + 24;
    const rayon = 20 + (i % 3) * 8;
    ctx.fillStyle = i % 2 ? "rgba(255, 111, 145, 0.5)" : "rgba(255, 209, 102, 0.4)";
    ctx.beginPath();
    ctx.arc(x, solY + 14, rayon, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(3, 20, 32, 0.85)";
  ctx.fillRect(0, solY + 6, LARGEUR, HAUTEUR - solY);
  ctx.restore();

  // Poissons qui nagent en arrière-plan, pour le décor.
  ctx.save();
  for (const poisson of poissonsFond) {
    const avance = (temps * poisson.vitesse + poisson.decalage) % (LARGEUR + 60);
    const x = poisson.sens > 0 ? avance - 30 : LARGEUR - avance + 30;
    const nage = Math.sin(temps * 2.4 + poisson.phase);
    const y = poisson.y + nage * 8;
    const battementQueue = 0.5 + nage * 0.16;
    const inclinaison = nage * 0.08;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(poisson.sens, 1);
    ctx.rotate(inclinaison);
    ctx.fillStyle = poisson.teinte;
    ctx.beginPath();
    ctx.ellipse(0, 0, poisson.taille, poisson.taille * 0.52, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-poisson.taille * 0.9, 0);
    ctx.lineTo(-poisson.taille * 1.5, -poisson.taille * battementQueue);
    ctx.lineTo(-poisson.taille * 1.5, poisson.taille * battementQueue);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(234, 249, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(poisson.taille * 0.58, -poisson.taille * 0.12, poisson.taille * 0.1, 0, Math.PI * 2);
    ctx.fill();
    if (Math.sin(temps * 3 + poisson.phase) > 0.92) {
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = poisson.teinte;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(-poisson.taille * 1.7, -poisson.taille * 0.55, poisson.taille * 0.12, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();

  // Bulles qui remontent vers la surface.
  ctx.save();
  for (const bulle of bulles) {
    const progression = (temps * bulle.vitesse + bulle.decalage) % (HAUTEUR + 40);
    const y = HAUTEUR + 20 - progression;
    const x = bulle.x + Math.sin(temps * 1.2 + bulle.derive) * 10;
    ctx.globalAlpha = 0.3 + 0.25 * Math.sin(temps * 3 + bulle.phase);
    ctx.strokeStyle = "rgba(180, 240, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, bulle.rayon, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}
function dessinerPanier(ctx, panier, temps) {
  const inclinaison = Math.max(-0.2, Math.min(0.2, panier.vitesse * 0.00025));
  const pulsation = 0.6 + 0.4 * Math.sin(temps * 6);
  const respiration = 1 + 0.04 * Math.sin(temps * 3.2);
  ctx.save();
  ctx.translate(panier.x + panier.largeur / 2, panier.y + panier.hauteur * 0.35);
  if (typeof chronoAimant !== "undefined" && chronoAimant > 0) {
    ctx.strokeStyle = "rgba(77, 216, 255, 0.45)";
    ctx.lineWidth = 2;
    ctx.shadowColor = COULEURS.cyan;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, REGLAGES.rayonAimant, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.rotate(inclinaison);
  ctx.scale(respiration, respiration);
  ctx.shadowColor = COULEURS.magenta;
  ctx.shadowBlur = 24;
  ctx.strokeStyle = COULEURS.magenta;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = -3; i <= 3; i++) {
    const departX = i * panier.largeur * 0.12;
    const balancement = Math.sin(temps * 4.5 + i * 0.8) * (4 + Math.sin(temps * 2 + i) * 2);
    ctx.beginPath();
    ctx.moveTo(departX, panier.hauteur * 0.15);
    ctx.quadraticCurveTo(departX + balancement, panier.hauteur * 1.15, departX + balancement * 0.7, panier.hauteur * 1.65);
    ctx.stroke();
  }

  ctx.shadowColor = COULEURS.cyan;
  ctx.shadowBlur = 26;
  ctx.fillStyle = "rgba(40, 240, 255, 0.22)";
  ctx.beginPath();
  ctx.ellipse(0, -panier.hauteur * 0.38, panier.largeur * 0.38, panier.hauteur * 1.2, 0, Math.PI, 0);
  ctx.lineTo(panier.largeur * 0.38, panier.hauteur * 0.25);
  ctx.quadraticCurveTo(0, panier.hauteur * 0.58, -panier.largeur * 0.38, panier.hauteur * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = COULEURS.cyan;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.shadowColor = COULEURS.blanc;
  ctx.shadowBlur = 8 * pulsation;
  ctx.fillStyle = COULEURS.blanc;
  ctx.beginPath();
  ctx.arc(-panier.largeur * 0.14, -panier.hauteur * 0.35, 4.5, 0, Math.PI * 2);
  ctx.arc(panier.largeur * 0.14, -panier.hauteur * 0.35, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COULEURS.fond;
  ctx.beginPath();
  ctx.arc(-panier.largeur * 0.14, -panier.hauteur * 0.35, 1.5, 0, Math.PI * 2);
  ctx.arc(panier.largeur * 0.14, -panier.hauteur * 0.35, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function dessinerCristal(ctx, objet, temps) {
  const r = objet.rayon;
  const dore = objet.type === DORE;
  const glace = objet.type === GLACE;
  const bouclier = objet.type === BOUCLIER;
  const couleur = dore ? COULEURS.or : glace ? COULEURS.glace : bouclier ? COULEURS.bouclier : COULEURS.cyan;
  const nage = 1 + 0.08 * Math.sin(temps * 6 + objet.pulsation);
  const balancement = Math.sin(temps * 5 + objet.pulsation) * 0.22;
  const battement = 0.5 + Math.sin(temps * 7 + objet.pulsation) * 0.12;
  ctx.rotate(balancement);
  ctx.scale(nage, 1);
  ctx.shadowColor = couleur;
  ctx.shadowBlur = 18;

  if (bouclier) {
    // Une perle protectrice nacrée.
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(155, 124, 255, 0.28)";
    ctx.fill();
    ctx.strokeStyle = couleur;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * r * 0.6, Math.sin(angle) * r * 0.6);
      ctx.stroke();
    }
    ctx.fillStyle = COULEURS.blanc;
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.2, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Un petit poisson : corps ovale, nageoire dorsale et queue.
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.95, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fillStyle = dore ? "rgba(255, 209, 102, 0.3)" : glace ? "rgba(158, 238, 255, 0.32)" : "rgba(40, 240, 255, 0.26)";
  ctx.fill();
  ctx.strokeStyle = couleur;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r * 0.85, 0);
  ctx.lineTo(-r * 1.5, -r * battement);
  ctx.lineTo(-r * 1.5, r * battement);
  ctx.closePath();
  ctx.fillStyle = couleur;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -r * 0.5);
  ctx.lineTo(r * 0.25, -r * 0.95);
  ctx.lineTo(r * 0.45, -r * 0.4);
  ctx.closePath();
  ctx.fillStyle = couleur;
  ctx.fill();

  ctx.fillStyle = COULEURS.blanc;
  ctx.beginPath();
  ctx.arc(r * 0.45, -r * 0.08, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
}
function dessinerBombe(ctx, objet, temps) {
  const r = objet.rayon * (1 + 0.09 * Math.sin(temps * 9 + objet.pulsation));
  ctx.rotate(objet.rotation * 0.4);
  ctx.shadowColor = COULEURS.rouge;
  ctx.shadowBlur = 22;
  ctx.strokeStyle = COULEURS.rouge;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    ctx.lineTo(Math.cos(angle) * (r + 7), Math.sin(angle) * (r + 7));
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = "#1a0614";
  ctx.fill();
  ctx.strokeStyle = COULEURS.magenta;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = COULEURS.rouge;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COULEURS.blanc;
  ctx.beginPath();
  ctx.arc(-r * 0.12, -r * 0.12, r * 0.1, 0, Math.PI * 2);
  ctx.fill();
}
function dessinerBoss(ctx, boss, temps) {
  ctx.save();
  ctx.translate(boss.x, boss.y + Math.sin(temps * 4) * 4);
  ctx.scale(boss.direction, 1);
  ctx.shadowColor = COULEURS.magenta;
  ctx.shadowBlur = 28;
  ctx.fillStyle = "rgba(255, 111, 145, 0.22)";
  ctx.strokeStyle = COULEURS.magenta;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-58, 0);
  ctx.quadraticCurveTo(-38, -28, 0, -30);
  ctx.quadraticCurveTo(38, -28, 58, 0);
  ctx.lineTo(42, 22);
  ctx.quadraticCurveTo(0, 34, -42, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = COULEURS.cyan;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-36, 20);
  ctx.quadraticCurveTo(-24, 45, -12, 21);
  ctx.moveTo(-8, 24);
  ctx.quadraticCurveTo(0, 50, 10, 24);
  ctx.moveTo(20, 21);
  ctx.quadraticCurveTo(34, 44, 42, 18);
  ctx.stroke();
  ctx.fillStyle = COULEURS.blanc;
  ctx.beginPath();
  ctx.arc(-20, -8, 5, 0, Math.PI * 2);
  ctx.arc(20, -8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COULEURS.rouge;
  ctx.beginPath();
  ctx.arc(-20, -8, 2, 0, Math.PI * 2);
  ctx.arc(20, -8, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function dessinerAimant(ctx, objet, temps) {
  const r = objet.rayon;
  const pulsation = 1 + 0.08 * Math.sin(temps * 6 + objet.pulsation);
  ctx.rotate(objet.rotation);
  ctx.scale(pulsation, pulsation);
  ctx.shadowColor = COULEURS.cyan;
  ctx.shadowBlur = 22;
  ctx.strokeStyle = COULEURS.cyan;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.58, Math.PI * 0.2, Math.PI * 1.8);
  ctx.stroke();
  ctx.strokeStyle = COULEURS.magenta;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-r * 0.55, -r * 0.45);
  ctx.lineTo(-r * 0.55, -r * 0.05);
  ctx.moveTo(r * 0.55, -r * 0.45);
  ctx.lineTo(r * 0.55, -r * 0.05);
  ctx.stroke();
  ctx.lineCap = "butt";
}
function dessinerObjet(ctx, objet, temps) {
  ctx.save();
  ctx.translate(objet.x, objet.y);
  if (objet.type === BOMBE) dessinerBombe(ctx, objet, temps);
  else if (objet.type === AIMANT) dessinerAimant(ctx, objet, temps);
  else dessinerCristal(ctx, objet, temps);
  ctx.restore();
}
