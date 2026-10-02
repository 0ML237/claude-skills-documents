// Conversions d'unités utilisées par la bibliothèque docx.
// Aucune valeur de design ici : uniquement des helpers.

// 1 mm = 56,692913... DXA. On arrondit à l'entier (DXA = twentieth of a point).
export const mmToDxa = (mm) => Math.round(mm * 56.6929);

// 1 pt = 20 DXA.
export const ptToDxa = (pt) => Math.round(pt * 20);

// Les tailles de police de la bibliothèque docx sont en demi-points.
export const ptToHalfPt = (pt) => Math.round(pt * 2);

// Les épaisseurs de bordure sont en huitièmes de point.
export const ptToEighth = (pt) => Math.round(pt * 8);

// Interligne (line) en 240e de point : 1.0 → 240, 1.4 → 336.
export const lineSpacing = (factor) => Math.round(factor * 240);

// Les hex de la bibliothèque docx sont sans '#'. On nettoie au cas où.
export const hex = (c) => (c || "").replace(/^#/, "").toUpperCase();

// Résolution d'une référence de couleur : si la valeur est un nom de jeton
// présent dans couleurs, renvoyer sa valeur ; sinon la laisser.
export const resolveColor = (ref, couleurs) => {
  if (!ref) return undefined;
  if (couleurs[ref]) return hex(couleurs[ref]);
  return hex(ref);
};

// Largeur de la zone de texte en DXA, calculée depuis la charte page.
export const zoneTexteDxa = (page) =>
  page.largeur_dxa - mmToDxa(page.marges_mm.gauche + page.marges_mm.droite);
