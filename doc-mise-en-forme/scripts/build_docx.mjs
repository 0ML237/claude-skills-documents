#!/usr/bin/env node
// Génère un DOCX à partir de contenu.md et charte.json.
//
// Usage :
//   node build_docx.mjs <contenu.md> <charte.json> <sortie.docx> [options]
//
// Options :
//   --toc-from-pdf=<pass1.pdf>  Insère un sommaire statique dont les numéros de
//                               page sont extraits du PDF de la passe 1. Ce
//                               contournement est nécessaire car LibreOffice en
//                               mode headless n'actualise pas les champs TOC
//                               (le DOCX conserve la hiérarchie de titres,
//                               Word peut toujours insérer un sommaire natif).

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { parseMarkdown } from "./lib/parse-md.mjs";
import { buildDocument } from "./lib/build-doc.mjs";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Usage : node build_docx.mjs <contenu.md> <charte.json> <sortie.docx> [--toc-from-pdf=<pass1.pdf>]");
    process.exit(2);
  }
  const [contenuPath, chartePath, sortiePath, ...flags] = args;
  const tocPdfArg = flags.find((f) => f.startsWith("--toc-from-pdf="));
  const tocPdfPath = tocPdfArg ? tocPdfArg.slice("--toc-from-pdf=".length) : null;

  const contenu = fs.readFileSync(contenuPath, "utf8");
  const charte = JSON.parse(fs.readFileSync(chartePath, "utf8"));

  const ast = parseMarkdown(contenu);
  charte._langue = (ast.yaml.langue || charte._langue || "fr").toLowerCase();

  let tocEntries = null;
  if (tocPdfPath) {
    tocEntries = buildTocEntries(ast, charte, tocPdfPath);
    console.log(`Sommaire : ${tocEntries.length} entrée(s) extraite(s).`);
  }

  const buffer = await buildDocument({
    ast,
    charte,
    tocEntries,
    baseDir: path.dirname(path.resolve(contenuPath)),
  });

  fs.writeFileSync(sortiePath, buffer);
  console.log(`DOCX écrit : ${sortiePath}${tocEntries ? " (avec sommaire)" : ""}`);
}

// Extrait la liste des entrées de sommaire à partir du PDF de la passe 1.
// Retourne [ { level: 2|3, text, page }, ... ]
function buildTocEntries(ast, charte, pdfPath) {
  const niveaux = charte.sommaire.niveaux || [2, 3];
  const headings = ast.blocks.filter(
    (b) => b.type === "heading" && niveaux.includes(b.level)
  );
  const pdfText = execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });
  // pdftotext sépare les pages par le caractère \f (form feed).
  const pages = pdfText.split("\f");
  // Hypothèse : le sommaire ajoute une page (vérifiée pour <40 entrées).
  // Les pages après la couverture sont décalées de +1 dans la passe 2.
  const tocPagesEstimate = Math.max(1, Math.ceil(headings.length / 40));
  const entries = [];
  // On commence la recherche après la page de garde (page 1).
  let searchStart = 1;
  for (const h of headings) {
    const needle = normalize(h.text);
    let found = -1;
    for (let p = searchStart; p < pages.length; p++) {
      const pageText = normalize(pages[p]);
      if (pageText.includes(needle)) {
        found = p + 1; // numéro humain
        searchStart = p; // les titres sont dans l'ordre, pas de retour en arrière
        break;
      }
    }
    if (found === -1) {
      // Repli : chercher partout
      for (let p = 1; p < pages.length; p++) {
        if (normalize(pages[p]).includes(needle)) { found = p + 1; break; }
      }
    }
    if (found !== -1) {
      entries.push({ level: h.level, text: h.text, page: found + tocPagesEstimate });
    }
  }
  return entries;
}

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
