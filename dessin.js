// Dessin du décor, du panier et des objets. Tout est tracé au canvas.

const etoiles = [];
for (let i = 0; i < 64; i++) {
  etoiles.push({ x: Math.random() * LARGEUR, y: Math.random() * HAUTEUR * 0.6, taille: Math.random() + 0.5, phase: Math.random() * 6.28 });
}
function dessinerFond(ctx, temps) {
  const degrade = ctx.createLinearGradient(0, 0, 0, HAUTEUR);
  degrade.addColorStop(0, "#111b12");
  degrade.addColorStop(0.52, COULEURS.fond);
  degrade.addColorStop(1, "#050805");
  ctx.fillStyle = degrade;
  ctx.fillRect(0, 0, LARGEUR, HAUTEUR);

  const horizon = HAUTEUR * 0.58;
  const halo = ctx.createRadialGradient(LARGEUR / 2, horizon, 4, LARGEUR / 2, horizon, LARGEUR * 0.8);
  halo.addColorStop(0, "rgba(143, 36, 36, 0.22)");
  halo.addColorStop(0.5, "rgba(110, 150, 55, 0.08)");
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, LARGEUR, HAUTEUR);

  ctx.save();
  ctx.globalAlpha = 0.9;
  for (let i = 0; i < 10; i++) {
    const largeur = 28 + (i % 3) * 13;
    const hauteur = 72 + (i * 31) % 120;
    const x = i * 54 - 12;
    const y = horizon - hauteur;
    ctx.fillStyle = i % 2 ? "#111811" : "#182016";
    ctx.fillRect(x, y, largeur, hauteur);
    ctx.fillStyle = "rgba(5, 8, 5, 0.9)";
    ctx.fillRect(x + largeur * 0.55, y - 10, largeur * 0.5, 12);
    ctx.strokeStyle = "rgba(78, 91, 61, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + largeur * 0.18, y + hauteur * 0.2);
    ctx.lineTo(x + largeur * 0.42, y + hauteur * 0.34);
    ctx.lineTo(x + largeur * 0.27, y + hauteur * 0.58);
    ctx.stroke();
    for (let ligne = 0; ligne < 3; ligne++) {
      for (let colonne = 0; colonne < 2; colonne++) {
        if ((i + ligne + colonne) % 3 !== 0) {
          ctx.fillStyle = ligne === 1 && colonne === 0 ? "rgba(210, 190, 75, 0.5)" : "rgba(76, 96, 63, 0.45)";
          ctx.fillRect(x + 7 + colonne * 15, y + 16 + ligne * 24, 6, 9);
        }
      }
    }
  }
  ctx.fillStyle = "rgba(2, 5, 2, 0.82)";
  ctx.fillRect(0, horizon - 3, LARGEUR, 8);
  ctx.restore();

  ctx.strokeStyle = COULEURS.grille;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = -9; i <= 9; i++) {
    ctx.moveTo(LARGEUR / 2, horizon);
    ctx.lineTo(LARGEUR / 2 + i * 78, HAUTEUR);
  }
  ctx.stroke();
  for (let i = 0; i < 14; i++) {
    const avancee = (i + (temps * 0.3) % 1) / 14;
    const y = horizon + Math.pow(avancee, 2.3) * (HAUTEUR - horizon);
    ctx.globalAlpha = 0.12 + avancee * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(LARGEUR, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.shadowColor = COULEURS.magenta;
  ctx.shadowBlur = 16;
  ctx.strokeStyle = "rgba(143, 36, 36, 0.5)";
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  ctx.lineTo(LARGEUR, horizon);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "rgba(110, 150, 55, 0.06)";
  ctx.fillRect(0, horizon - 34 + Math.sin(temps * 0.4) * 4, LARGEUR, 34);
}
function dessinerPanier(ctx, panier, temps) {
  const inclinaison = Math.max(-0.2, Math.min(0.2, panier.vitesse * 0.00025));
  const pulsation = 0.6 + 0.4 * Math.sin(temps * 6);
  ctx.save();
  ctx.translate(panier.x + panier.largeur / 2, panier.y + panier.hauteur / 2);
  if (typeof chronoAimant !== "undefined" && chronoAimant > 0) {
    ctx.strokeStyle = "rgba(159, 202, 88, 0.45)";
    ctx.lineWidth = 2;
    ctx.shadowColor = COULEURS.cyan;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, REGLAGES.rayonAimant, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.rotate(inclinaison);
  ctx.shadowColor = COULEURS.cyan;
  ctx.shadowBlur = 26;
  ctx.fillStyle = "rgba(40, 240, 255, 0.16)";
  ctx.beginPath();
  ctx.roundRect(-panier.largeur / 2, -panier.hauteur / 2, panier.largeur, panier.hauteur, 8);
  ctx.fill();
  ctx.shadowBlur = 10;
  ctx.strokeStyle = COULEURS.cyan;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.shadowColor = COULEURS.magenta;
  ctx.shadowBlur = 16 * pulsation;
  ctx.fillStyle = COULEURS.magenta;
  ctx.fillRect(-panier.largeur * 0.17, -2, panier.largeur * 0.34, 4);
  ctx.fillStyle = "rgba(40, 240, 255, 0.6)";
  ctx.fillRect(-panier.largeur * 0.32, panier.hauteur / 2, 10, 3);
  ctx.fillRect(panier.largeur * 0.32 - 10, panier.hauteur / 2, 10, 3);
  ctx.restore();
}
function dessinerCristal(ctx, objet, temps) {
  const r = objet.rayon;
  const dore = objet.type === DORE;
  const glace = objet.type === GLACE;
  const bouclier = objet.type === BOUCLIER;
  const couleur = dore ? COULEURS.or : glace ? COULEURS.glace : bouclier ? COULEURS.bouclier : COULEURS.cyan;
  const battement = 1 + 0.06 * Math.sin(temps * 5 + objet.pulsation);
  ctx.rotate(objet.rotation);
  ctx.scale(battement, battement);
  ctx.shadowColor = couleur;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  if (bouclier) {
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 3;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  } else {
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.62, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.62, 0);
  }
  ctx.closePath();
  ctx.fillStyle = dore ? "rgba(255, 209, 102, 0.22)" : glace ? "rgba(158, 238, 255, 0.3)" : bouclier ? "rgba(155, 124, 255, 0.3)" : "rgba(40, 240, 255, 0.2)";
  ctx.fill();
  ctx.strokeStyle = couleur;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = COULEURS.blanc;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
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
