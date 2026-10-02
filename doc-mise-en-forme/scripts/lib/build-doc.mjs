// Construit un objet docx.Document à partir de l'AST retourné par parse-md
// et des jetons de charte. Aucune valeur de design n'est écrite en dur ici :
// tout vient de `charte`.

import fs from "node:fs";
import path from "node:path";
import {
  Document, Packer, Paragraph, TextRun, PageBreak, PageNumber,
  Header, Footer, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, LevelFormat, LineRuleType, LeaderType,
  ShadingType, SectionType, TabStopType,
  WidthType, ImageRun, ExternalHyperlink,
} from "docx";

import {
  mmToDxa, ptToHalfPt, ptToEighth, lineSpacing,
  hex, zoneTexteDxa,
} from "./tokens.mjs";
import { parseInline } from "./parse-md.mjs";

const BORDER_NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

// -----------------------------------------------------------------------------
// Point d'entrée
// -----------------------------------------------------------------------------

export async function buildDocument({ ast, charte, tocEntries, baseDir }) {
  const ctx = makeContext(charte, baseDir);

  // Première section : page de garde, sans en-tête ni pied.
  const coverChildren = renderCover(ast.yaml, ctx);

  // Deuxième section : corps (sommaire statique optionnel + contenu).
  const bodyChildren = [];
  if (tocEntries && tocEntries.length) {
    bodyChildren.push(...renderStaticToc(tocEntries, ctx));
  }
  for (const block of ast.blocks) {
    bodyChildren.push(...renderBlock(block, ctx));
  }

  const doc = new Document({
    creator: ast.yaml.auteur || "",
    title: ast.yaml.titre || "",
    description: ast.yaml.sous_titre || "",
    features: { updateFields: true },
    styles: buildStyles(ctx),
    numbering: buildNumbering(ctx),
    sections: [
      {
        properties: {
          page: pageProps(ctx),
          type: SectionType.NEXT_PAGE,
          titlePage: false,
        },
        headers: {}, // page de garde : rien
        footers: {},
        children: coverChildren,
      },
      {
        properties: {
          page: pageProps(ctx),
          type: SectionType.NEXT_PAGE,
          titlePage: false,
        },
        headers: { default: new Header({ children: [renderHeader(ast.yaml, ctx)] }) },
        footers: { default: new Footer({ children: [renderFooter(ast.yaml, ctx)] }) },
        children: bodyChildren,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// -----------------------------------------------------------------------------
// Contexte dérivé de la charte
// -----------------------------------------------------------------------------

function makeContext(charte, baseDir) {
  const langue = (charte._langue || "fr");
  const libelles = charte.libelles[langue] || charte.libelles.fr;
  return {
    charte,
    baseDir,
    libelles,
    langue,
    couleurs: Object.fromEntries(
      Object.entries(charte.couleurs).map(([k, v]) => [k, hex(v)])
    ),
    zoneTexte: zoneTexteDxa(charte.page),
    police: charte.polices,
    taille: charte.tailles_pt,
    inter: charte.interligne,
    esp: charte.espacement_pt,
  };
}

function pageProps(ctx) {
  const { page } = ctx.charte;
  return {
    size: { width: page.largeur_dxa, height: page.hauteur_dxa },
    margin: {
      top: mmToDxa(page.marges_mm.haut),
      bottom: mmToDxa(page.marges_mm.bas),
      left: mmToDxa(page.marges_mm.gauche),
      right: mmToDxa(page.marges_mm.droite),
      header: mmToDxa(page.entete_mm),
      footer: mmToDxa(page.pied_mm),
    },
  };
}

// -----------------------------------------------------------------------------
// Styles (déclaration unique, référencée par les paragraphes)
// -----------------------------------------------------------------------------

function buildStyles(ctx) {
  const texte = ctx.couleurs.texte;
  return {
    default: {
      document: {
        run: {
          font: ctx.police.texte,
          size: ptToHalfPt(ctx.taille.corps),
          color: texte,
        },
        paragraph: {
          spacing: {
            after: ctx.esp.apres_paragraphe * 20,
            line: lineSpacing(ctx.inter.corps),
            lineRule: LineRuleType.AUTO,
          },
          widowControl: true,
        },
      },
    },
    paragraphStyles: [
      // Heading 1 (= ## du Markdown, niveau 2 de la hiérarchie éditoriale)
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: ctx.police.titres,
          size: ptToHalfPt(ctx.taille.h2),
          color: texte,
          bold: ctx.charte.graisse_titres.h2 === "gras",
        },
        paragraph: {
          spacing: {
            before: ctx.esp.avant_h2 * 20,
            after: ctx.esp.apres_h2 * 20,
            line: lineSpacing(ctx.inter.titres),
            lineRule: LineRuleType.AUTO,
          },
          keepNext: true,
          keepLines: true,
          outlineLevel: 0,
        },
      },
      // Heading 2 (= ###)
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: ctx.police.titres,
          size: ptToHalfPt(ctx.taille.h3),
          color: texte,
          bold: ctx.charte.graisse_titres.h3 === "gras",
        },
        paragraph: {
          spacing: {
            before: ctx.esp.avant_h3 * 20,
            after: ctx.esp.apres_h3 * 20,
            line: lineSpacing(ctx.inter.titres),
            lineRule: LineRuleType.AUTO,
          },
          keepNext: true,
          keepLines: true,
          outlineLevel: 1,
        },
      },
      // Heading 3 (= ####)
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: ctx.police.titres,
          size: ptToHalfPt(ctx.taille.h4),
          color: texte,
          bold: ctx.charte.graisse_titres.h4 === "gras",
        },
        paragraph: {
          spacing: {
            before: ctx.esp.avant_h4 * 20,
            after: ctx.esp.apres_h4 * 20,
            line: lineSpacing(ctx.inter.titres),
            lineRule: LineRuleType.AUTO,
          },
          keepNext: true,
          keepLines: true,
          outlineLevel: 2,
        },
      },
    ],
  };
}

// -----------------------------------------------------------------------------
// Numbering (listes à puces + numérotées)
// -----------------------------------------------------------------------------

function buildNumbering(ctx) {
  const retrait = mmToDxa(ctx.charte.listes.retrait_mm);
  return {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: ctx.charte.listes.puce_niveau1,
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: retrait, hanging: retrait } },
              run: { font: ctx.police.texte },
            },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: ctx.charte.listes.puce_niveau2,
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: retrait * 2, hanging: retrait } },
              run: { font: ctx.police.texte },
            },
          },
        ],
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: retrait, hanging: retrait } },
            },
          },
        ],
      },
    ],
  };
}

// -----------------------------------------------------------------------------
// Inline runs → TextRun[]
// -----------------------------------------------------------------------------

function inlineToRuns(inline, ctx, baseOpts = {}) {
  const out = [];
  for (const r of inline) {
    if (r.href) {
      const run = new TextRun({
        ...baseOpts,
        text: r.text,
        color: ctx.couleurs.lien || ctx.couleurs.accent,
        underline: {},
      });
      out.push(new ExternalHyperlink({ link: r.href, children: [run] }));
    } else if (r.code) {
      out.push(new TextRun({
        ...baseOpts,
        text: r.text,
        font: ctx.police.code,
        size: ptToHalfPt(ctx.taille.code),
      }));
    } else {
      out.push(new TextRun({
        ...baseOpts,
        text: r.text,
        bold: r.bold || baseOpts.bold,
        italics: r.italic || baseOpts.italics,
      }));
    }
  }
  return out;
}

// -----------------------------------------------------------------------------
// Rendu : page de garde, en-tête, pied, sommaire
// -----------------------------------------------------------------------------

function renderCover(meta, ctx) {
  const out = [];
  const grey = ctx.couleurs.secondaire;
  const texte = ctx.couleurs.texte;
  const accent = ctx.couleurs.accent;

  // 1. Organisation en haut
  if (meta.organisation) {
    out.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 0, line: lineSpacing(ctx.inter.corps), lineRule: LineRuleType.AUTO },
      children: [new TextRun({
        text: meta.organisation,
        font: ctx.police.secondaire,
        size: ptToHalfPt(ctx.taille.secondaire),
        color: grey,
        smallCaps: true,
        characterSpacing: 10, // +0,5 pt
      })],
    }));
  }

  // 2. Titre, placé environ au tiers de la page
  const avantTitreDxa = mmToDxa(ctx.charte.couverture.espace_avant_titre_mm);
  // Contrainte de largeur : retrait droit pour limiter la largeur du titre.
  const largeurTitreDxa = mmToDxa(ctx.charte.couverture.largeur_max_titre_mm);
  const retraitDroiteTitre = Math.max(0, ctx.zoneTexte - largeurTitreDxa);
  out.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: {
      before: avantTitreDxa,
      after: 0,
      line: lineSpacing(1.15),
      lineRule: LineRuleType.AUTO,
    },
    indent: { right: retraitDroiteTitre },
    children: [new TextRun({
      text: meta.titre || "",
      font: ctx.police.titres,
      size: ptToHalfPt(ctx.taille.titre_couverture),
      color: texte,
    })],
  }));

  // 3. Filet d'accent (bordure basse d'un paragraphe de largeur réduite)
  const longueurFiletDxa = mmToDxa(ctx.charte.couverture.filet_accent.longueur_mm);
  const epaisseurFilet = ptToEighth(ctx.charte.couverture.filet_accent.epaisseur_pt);
  out.push(new Paragraph({
    spacing: { before: 160, after: 160 },
    indent: { right: Math.max(0, ctx.zoneTexte - longueurFiletDxa) },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: epaisseurFilet,
        color: accent,
        space: 1,
      },
    },
    children: [new TextRun({ text: "" })],
  }));

  // 4. Sous-titre
  if (meta.sous_titre) {
    out.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 60, after: 0, line: lineSpacing(1.3), lineRule: LineRuleType.AUTO },
      indent: { right: retraitDroiteTitre },
      children: [new TextRun({
        text: meta.sous_titre,
        font: ctx.police.titres,
        size: ptToHalfPt(ctx.taille.sous_titre),
        color: grey,
        italics: true,
      })],
    }));
  }

  // 5. Métadonnées en bas de page : poussées vers le bas par un gros espacement
  //    puis table deux colonnes sans bordure.
  const metaRows = [];
  const champs = ctx.charte.couverture.afficher_metadonnees;
  const labelFor = (k) => ctx.libelles[k] || k;
  const valueOf = (k) => meta[k];
  for (const k of champs) {
    const v = valueOf(k);
    if (!v) continue;
    metaRows.push({ label: labelFor(k), value: String(v) });
  }
  if (metaRows.length) {
    // Spacer modéré avant les métadonnées. On ne tente pas de les coller
    // au bas de la page : LibreOffice et Word gèrent l'ancrage absolu
    // différemment, et un placement « vers le bas » suffit au rendu éditorial.
    out.push(new Paragraph({
      spacing: { before: mmToDxa(30), after: 0 },
      children: [new TextRun({ text: "" })],
    }));
    const colLabel = mmToDxa(40);
    const colValue = ctx.zoneTexte - colLabel;
    const metaTable = new Table({
      width: { size: ctx.zoneTexte, type: WidthType.DXA },
      columnWidths: [colLabel, colValue],
      borders: {
        top: BORDER_NONE, bottom: BORDER_NONE,
        left: BORDER_NONE, right: BORDER_NONE,
        insideHorizontal: BORDER_NONE, insideVertical: BORDER_NONE,
      },
      rows: metaRows.map((row) => new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: colLabel, type: WidthType.DXA },
            borders: { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_NONE },
            margins: { top: 40, bottom: 40, left: 0, right: 100 },
            children: [new Paragraph({
              spacing: { after: 0 },
              children: [new TextRun({
                text: row.label,
                font: ctx.police.secondaire,
                size: ptToHalfPt(ctx.taille.secondaire),
                color: grey,
                smallCaps: true,
                characterSpacing: 10,
              })],
            })],
          }),
          new TableCell({
            width: { size: colValue, type: WidthType.DXA },
            borders: { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_NONE },
            margins: { top: 40, bottom: 40, left: 0, right: 0 },
            children: [new Paragraph({
              spacing: { after: 0 },
              children: [new TextRun({
                text: row.value,
                font: ctx.police.texte,
                size: ptToHalfPt(ctx.taille.corps),
                color: texte,
              })],
            })],
          }),
        ],
      })),
    });
    out.push(metaTable);
  }

  return out;
}

function renderHeader(meta, ctx) {
  const grey = ctx.couleurs.secondaire;
  const filet = ctx.couleurs.filet;
  const maxCar = ctx.charte.entete_pied.titre_court_max_car;
  let titreCourt = meta.titre || "";
  if (titreCourt.length > maxCar) {
    titreCourt = titreCourt.slice(0, maxCar - 1).trimEnd() + "…";
  }
  const confid = meta.confidentialite || "";
  const rightTab = ctx.zoneTexte;

  return new Paragraph({
    spacing: { after: 0, line: lineSpacing(1.2), lineRule: LineRuleType.AUTO },
    tabStops: [{ type: TabStopType.RIGHT, position: rightTab }],
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: ptToEighth(ctx.charte.entete_pied.filet_entete_pt),
        color: filet,
        space: 2,
      },
    },
    children: [
      new TextRun({
        text: titreCourt,
        font: ctx.police.secondaire,
        size: ptToHalfPt(ctx.taille.secondaire),
        color: grey,
        smallCaps: true,
        characterSpacing: 10,
      }),
      new TextRun({ text: "\t" }),
      new TextRun({
        text: confid,
        font: ctx.police.secondaire,
        size: ptToHalfPt(ctx.taille.secondaire),
        color: grey,
        smallCaps: true,
        characterSpacing: 10,
      }),
    ],
  });
}

function renderFooter(meta, ctx) {
  const grey = ctx.couleurs.secondaire;
  const orga = meta.organisation || "";
  const rightTab = ctx.zoneTexte;

  const runs = [
    new TextRun({
      text: orga,
      font: ctx.police.secondaire,
      size: ptToHalfPt(ctx.taille.secondaire),
      color: grey,
      smallCaps: true,
      characterSpacing: 10,
    }),
    new TextRun({ text: "\t" }),
    new TextRun({
      text: `${ctx.libelles.page} `,
      font: ctx.police.secondaire,
      size: ptToHalfPt(ctx.taille.secondaire),
      color: grey,
      smallCaps: true,
      characterSpacing: 10,
    }),
    new TextRun({
      children: [PageNumber.CURRENT],
      font: ctx.police.secondaire,
      size: ptToHalfPt(ctx.taille.secondaire),
      color: grey,
    }),
    new TextRun({
      text: ` ${ctx.libelles.sur} `,
      font: ctx.police.secondaire,
      size: ptToHalfPt(ctx.taille.secondaire),
      color: grey,
      smallCaps: true,
      characterSpacing: 10,
    }),
    new TextRun({
      children: [PageNumber.TOTAL_PAGES],
      font: ctx.police.secondaire,
      size: ptToHalfPt(ctx.taille.secondaire),
      color: grey,
    }),
  ];

  return new Paragraph({
    spacing: { before: 0, after: 0, line: lineSpacing(1.2), lineRule: LineRuleType.AUTO },
    tabStops: [{ type: TabStopType.RIGHT, position: rightTab }],
    children: runs,
  });
}

// Sommaire statique : chaque entrée est un paragraphe « titre … page » avec
// tabulation à droite et conduite en points. Évite la dépendance au champ
// TOC natif, que LibreOffice headless n'actualise pas lors de l'export PDF.
function renderStaticToc(entries, ctx) {
  const out = [];
  // Titre du sommaire — pas de style Heading pour qu'il n'apparaisse pas
  // dans la liste des entrées lui-même.
  out.push(new Paragraph({
    spacing: {
      before: 0,
      after: ctx.esp.apres_h2 * 20,
      line: lineSpacing(ctx.inter.titres),
      lineRule: LineRuleType.AUTO,
    },
    keepNext: true,
    children: [new TextRun({
      text: ctx.libelles.sommaire,
      font: ctx.police.titres,
      size: ptToHalfPt(ctx.taille.h2),
      color: ctx.couleurs.texte,
    })],
  }));
  const retraitN3 = mmToDxa(ctx.charte.sommaire.retrait_niveau3_mm || 6);
  const rightTab = ctx.zoneTexte;
  const points = ctx.charte.sommaire.points_de_conduite !== false;
  for (const entry of entries) {
    const niveau2 = entry.level === 2;
    out.push(new Paragraph({
      spacing: {
        after: 60,
        line: lineSpacing(1.3),
        lineRule: LineRuleType.AUTO,
      },
      indent: niveau2 ? undefined : { left: retraitN3 },
      tabStops: [{
        type: TabStopType.RIGHT,
        position: rightTab,
        leader: points ? LeaderType.DOT : undefined,
      }],
      children: [
        new TextRun({
          text: entry.text,
          font: ctx.police.texte,
          size: ptToHalfPt(ctx.taille.corps),
          color: ctx.couleurs.texte,
        }),
        new TextRun({ text: "\t" }),
        new TextRun({
          text: String(entry.page),
          font: ctx.police.texte,
          size: ptToHalfPt(ctx.taille.corps),
          color: ctx.couleurs.texte,
        }),
      ],
    }));
  }
  if (ctx.charte.pagination.saut_apres_sommaire) {
    out.push(new Paragraph({ children: [new PageBreak()] }));
  }
  return out;
}

// -----------------------------------------------------------------------------
// Rendu : blocs
// -----------------------------------------------------------------------------

function renderBlock(block, ctx) {
  switch (block.type) {
    case "heading": return [renderHeading(block, ctx)];
    case "paragraph": return [renderParagraph(block, ctx)];
    case "list": return renderList(block, ctx);
    case "table": return renderTable(block, ctx);
    case "code": return renderCode(block, ctx);
    case "quote": return [renderQuote(block, ctx)];
    case "callout": return renderCallout(block, ctx);
    case "image": return renderImage(block, ctx);
    default: return [];
  }
}

function renderHeading(block, ctx) {
  const styleId = `Heading${block.level - 1}`; // ## → Heading1, ### → Heading2, #### → Heading3
  const isAnnexe = block.level === 2 && isAnnexeTitle(block.text, ctx.libelles);
  const pageBreakBefore = isAnnexe && ctx.charte.pagination.saut_avant_annexes;
  return new Paragraph({
    style: styleId,
    pageBreakBefore,
    children: inlineToRuns(block.inline, ctx),
  });
}

function isAnnexeTitle(text, libelles) {
  const annex = (libelles.annexe || "Annexe").toLowerCase();
  const t = text.toLowerCase();
  return t.startsWith(annex) || t.startsWith("appendix");
}

function renderParagraph(block, ctx) {
  return new Paragraph({
    children: inlineToRuns(block.inline, ctx),
  });
}

function renderList(block, ctx) {
  const ref = block.ordered ? "numbers" : "bullets";
  return block.items.map((item) => new Paragraph({
    numbering: { reference: ref, level: item.level || 0 },
    spacing: {
      after: ctx.esp.entre_puces * 20,
      line: lineSpacing(ctx.inter.corps),
      lineRule: LineRuleType.AUTO,
    },
    children: inlineToRuns(item.inline, ctx),
  }));
}

function renderTable(block, ctx) {
  const n = block.header.length;
  // Largeurs : simple répartition égale (acceptable pour le format cible).
  // Pour une pondération fine, utiliser le texte le plus long de chaque colonne.
  const widths = equalColumnWidths(ctx.zoneTexte, n);
  const texte = ctx.couleurs.texte;
  const filetLeger = ctx.couleurs.filet_leger;
  const tabConf = ctx.charte.tableaux;
  const margins = {
    top: tabConf.marges_cellule_dxa.haut,
    bottom: tabConf.marges_cellule_dxa.bas,
    left: tabConf.marges_cellule_dxa.gauche,
    right: tabConf.marges_cellule_dxa.droite,
  };

  const headerCell = (cell, i) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    margins,
    borders: {
      top: BORDER_NONE,
      bottom: { style: BorderStyle.SINGLE, size: ptToEighth(tabConf.filet_entete_pt), color: texte },
      left: BORDER_NONE, right: BORDER_NONE,
    },
    children: [new Paragraph({
      alignment: block.numericCols[i] && tabConf.aligner_nombres_a_droite
        ? AlignmentType.RIGHT : AlignmentType.LEFT,
      spacing: { after: 0, line: lineSpacing(ctx.inter.tableau), lineRule: LineRuleType.AUTO },
      children: inlineToRuns(cell, ctx, {
        font: ctx.police.secondaire,
        size: ptToHalfPt(ctx.taille.tableau_entete),
        color: texte,
        bold: true,
        smallCaps: true,
        characterSpacing: 10,
      }),
    })],
  });

  const dataCell = (cell, i) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    margins,
    borders: { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_NONE },
    children: [new Paragraph({
      alignment: block.numericCols[i] && tabConf.aligner_nombres_a_droite
        ? AlignmentType.RIGHT : AlignmentType.LEFT,
      spacing: { after: 0, line: lineSpacing(ctx.inter.tableau), lineRule: LineRuleType.AUTO },
      children: inlineToRuns(cell, ctx, {
        font: ctx.police.texte,
        size: ptToHalfPt(ctx.taille.tableau),
        color: texte,
      }),
    })],
  });

  const rows = [
    new TableRow({
      tableHeader: tabConf.repeter_entete,
      cantSplit: tabConf.lignes_insecables,
      children: block.header.map((c, i) => headerCell(c, i)),
    }),
    ...block.rows.map((row) => new TableRow({
      cantSplit: tabConf.lignes_insecables,
      children: row.map((c, i) => dataCell(c, i)),
    })),
  ];

  const table = new Table({
    width: { size: ctx.zoneTexte, type: WidthType.DXA },
    columnWidths: widths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: ptToEighth(tabConf.filet_haut_pt), color: texte },
      bottom: { style: BorderStyle.SINGLE, size: ptToEighth(tabConf.filet_bas_pt), color: texte },
      left: BORDER_NONE, right: BORDER_NONE,
      insideHorizontal: {
        style: BorderStyle.SINGLE,
        size: ptToEighth(tabConf.filet_lignes_pt),
        color: filetLeger,
      },
      insideVertical: BORDER_NONE,
    },
    rows,
  });

  const out = [];
  if (block.caption) {
    out.push(new Paragraph({
      spacing: { before: 0, after: 60, line: lineSpacing(1.25), lineRule: LineRuleType.AUTO },
      keepNext: true,
      children: [new TextRun({
        text: block.caption,
        font: ctx.police.secondaire,
        size: ptToHalfPt(ctx.taille.legende),
        color: ctx.couleurs.secondaire,
      })],
    }));
  }
  out.push(table);
  // Paragraphe vide à la suite pour aérer avant le prochain contenu
  out.push(new Paragraph({ spacing: { after: ctx.esp.apres_paragraphe * 20 }, children: [new TextRun({ text: "" })] }));
  return out;
}

function equalColumnWidths(total, n) {
  const base = Math.floor(total / n);
  const widths = new Array(n).fill(base);
  widths[n - 1] = total - base * (n - 1); // le dernier absorbe l'arrondi
  return widths;
}

function renderCode(block, ctx) {
  const retrait = mmToDxa(ctx.charte.code.retrait_mm);
  // Chaque ligne devient un paragraphe, pour permettre à Word d'adapter les sauts
  // sans perdre les sauts de ligne.
  const lines = block.text.split("\n");
  return lines.map((line, idx) => new Paragraph({
    indent: { left: retrait, right: retrait },
    spacing: {
      after: idx === lines.length - 1 ? ctx.esp.apres_paragraphe * 20 : 0,
      line: lineSpacing(ctx.inter.code),
      lineRule: LineRuleType.AUTO,
    },
    keepLines: true,
    keepNext: idx < lines.length - 1,
    shading: {
      type: ShadingType.CLEAR,
      color: "auto",
      fill: ctx.couleurs.fond_code,
    },
    children: [new TextRun({
      text: line || " ",
      font: ctx.police.code,
      size: ptToHalfPt(ctx.taille.code),
      color: ctx.couleurs.texte,
    })],
  }));
}

function renderQuote(block, ctx) {
  return new Paragraph({
    indent: { left: mmToDxa(12) },
    spacing: {
      before: 60, after: ctx.esp.apres_paragraphe * 20,
      line: lineSpacing(ctx.inter.corps),
      lineRule: LineRuleType.AUTO,
    },
    children: inlineToRuns(block.inline, ctx, { italics: true }),
  });
}

function renderCallout(block, ctx) {
  const conf = ctx.charte.blocs[block.kind];
  if (!conf) return [renderParagraph({ type: "paragraph", inline: block.inline }, ctx)];
  const filetColor = ctx.couleurs[conf.filet] || hex(conf.filet);
  const libelleColor = ctx.couleurs[conf.libelle_couleur] || hex(conf.libelle_couleur);
  const borderStyle = conf.style_filet === "pointille" ? BorderStyle.DOTTED : BorderStyle.SINGLE;
  const borderLeft = {
    style: borderStyle,
    size: ptToEighth(ctx.charte.blocs.epaisseur_filet_pt),
    color: filetColor,
    space: 8,
  };
  const retrait = mmToDxa(ctx.charte.blocs.retrait_mm);
  const avantApres = ctx.esp.avant_apres_bloc * 20;
  const libelleKey = {
    NOTE: "note", WARNING: "attention", DECISION: "decision",
    ACTION: "action", "A-COMPLETER": "a_completer",
  }[block.kind];
  const libelle = ctx.libelles[libelleKey] || block.kind;

  const out = [];
  // Ligne du libellé
  out.push(new Paragraph({
    indent: { left: retrait },
    spacing: { before: avantApres, after: 0, line: lineSpacing(1.2), lineRule: LineRuleType.AUTO },
    keepNext: true,
    keepLines: true,
    border: { left: borderLeft },
    children: [new TextRun({
      text: libelle,
      font: ctx.police.secondaire,
      size: ptToHalfPt(ctx.taille.secondaire),
      color: libelleColor,
      bold: true,
      smallCaps: true,
      characterSpacing: 10,
    })],
  }));
  // Texte sur une ligne séparée (ou plusieurs si le contenu contient des \n)
  const bodyLines = (block.raw || "").split(/\n+/).filter((l) => l.trim());
  // Si on n'a pas de retour à la ligne, on prend l'inline direct.
  const paras = bodyLines.length ? bodyLines : [block.raw || ""];
  paras.forEach((line, idx) => {
    const inline = parseInline(line);
    const isLast = idx === paras.length - 1;
    out.push(new Paragraph({
      indent: { left: retrait },
      spacing: {
        after: isLast ? avantApres : ctx.esp.apres_paragraphe * 20,
        line: lineSpacing(ctx.inter.corps),
        lineRule: LineRuleType.AUTO,
      },
      keepLines: true,
      keepNext: !isLast,
      border: { left: borderLeft },
      children: inlineToRuns(inline, ctx),
    }));
  });
  return out;
}

function renderImage(block, ctx) {
  const out = [];
  try {
    const abs = path.isAbsolute(block.src) ? block.src : path.join(ctx.baseDir, block.src);
    const data = fs.readFileSync(abs);
    const type = (path.extname(abs).slice(1) || "png").toLowerCase().replace("jpeg", "jpg");
    // Largeur cible : zone de texte, hauteur proportionnelle (approximation 2:3 par défaut
    // car on ne lit pas les dimensions ici — l'utilisateur peut forcer un ratio en préparant l'image).
    const widthDxa = ctx.zoneTexte;
    const widthPx = Math.round(widthDxa / 15); // 1 px ≈ 15 DXA à 96 DPI
    const heightPx = Math.round(widthPx * 0.6); // ratio par défaut
    out.push(new Paragraph({
      spacing: { after: 60 },
      keepNext: true,
      children: [new ImageRun({
        data,
        transformation: { width: widthPx, height: heightPx },
        type,
        altText: {
          title: block.alt || "Image",
          description: block.alt || "",
          name: path.basename(abs),
        },
      })],
    }));
  } catch (e) {
    out.push(new Paragraph({
      children: [new TextRun({
        text: `[Image introuvable : ${block.src}]`,
        italics: true,
        color: ctx.couleurs.attention,
      })],
    }));
  }
  if (block.caption) {
    out.push(new Paragraph({
      spacing: { after: ctx.esp.apres_paragraphe * 20, line: lineSpacing(1.25), lineRule: LineRuleType.AUTO },
      children: [new TextRun({
        text: block.caption,
        font: ctx.police.secondaire,
        size: ptToHalfPt(ctx.taille.legende),
        color: ctx.couleurs.secondaire,
      })],
    }));
  }
  return out;
}
