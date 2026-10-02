// Mini-parseur Markdown ciblé sur le format accepté par doc-contenu.
// Ne cherche pas à couvrir tout CommonMark : seulement ce que le skill produit.
//
// Sortie : { yaml: object, blocks: [...] } où chaque bloc est l'une des formes :
//   { type: 'heading', level: 2|3|4, text, inline }
//   { type: 'paragraph', inline }
//   { type: 'list', ordered: bool, items: [[inline], ...] }
//   { type: 'table', header: [inline], rows: [[inline, ...], ...],
//                    caption?: string, numericCols: [bool, ...] }
//   { type: 'code', lang, text }
//   { type: 'quote', inline }
//   { type: 'callout', kind: 'NOTE'|'WARNING'|'DECISION'|'ACTION'|'A-COMPLETER',
//                      inline, raw: string }
//   { type: 'image', alt, src, caption?: string }
//
// Inline : [ { text, bold?, italic?, code?, href? }, ... ]

import * as yaml from "js-yaml";

const CALLOUT_KINDS = ["NOTE", "WARNING", "DECISION", "ACTION", "A-COMPLETER"];

export function parseMarkdown(source) {
  const lines = source.split(/\r?\n/);
  let i = 0;

  // --- YAML frontmatter ---
  let yamlData = {};
  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    if (end > 0) {
      yamlData = yaml.load(lines.slice(1, end).join("\n")) || {};
      i = end + 1;
    }
  }

  const blocks = [];
  const pushPara = (textLines) => {
    const text = textLines.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", inline: parseInline(text) });
  };

  let paraBuf = [];
  const flushPara = () => {
    if (paraBuf.length) {
      pushPara(paraBuf);
      paraBuf = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Ligne vide → fin de paragraphe
    if (/^\s*$/.test(line)) {
      flushPara();
      i++;
      continue;
    }

    // Bloc de code fermé par ```
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      flushPara();
      const lang = fence[1] || "";
      i++;
      const codeLines = [];
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consomme la ```
      blocks.push({ type: "code", lang, text: codeLines.join("\n") });
      continue;
    }

    // Callout : > [!TYPE]
    const callout = line.match(/^>\s*\[!([A-Z-]+)\]\s*(.*)$/);
    if (callout && CALLOUT_KINDS.includes(callout[1])) {
      flushPara();
      const kind = callout[1];
      const content = [];
      if (callout[2]) content.push(callout[2]);
      i++;
      while (i < lines.length && /^>/.test(lines[i])) {
        content.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const raw = content.join("\n").trim();
      blocks.push({ type: "callout", kind, raw, inline: parseInline(raw) });
      continue;
    }

    // Citation : > (sans [!TYPE])
    if (/^>\s/.test(line)) {
      flushPara();
      const quoteLines = [];
      while (i < lines.length && /^>/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const text = quoteLines.join(" ").trim();
      blocks.push({ type: "quote", inline: parseInline(text) });
      continue;
    }

    // Titre : ##, ###, ####
    const heading = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (heading) {
      flushPara();
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text: heading[2],
        inline: parseInline(heading[2]),
      });
      i++;
      continue;
    }

    // Image : ![alt](path) suivie éventuellement d'une ligne de légende
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (image) {
      flushPara();
      let caption;
      if (i + 1 < lines.length && lines[i + 1].trim() && !isBlockStart(lines[i + 1])) {
        caption = lines[i + 1].trim();
        i += 2;
      } else {
        i++;
      }
      blocks.push({ type: "image", alt: image[1], src: image[2], caption });
      continue;
    }

    // Tableau : ligne commençant par |
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s-:|]+\|?\s*$/.test(lines[i + 1])) {
      // Récupère éventuellement une légende depuis le paragraphe en cours.
      let caption;
      if (paraBuf.length) {
        const prev = paraBuf.join(" ").trim();
        const m = prev.match(/^((?:Tableau|Table)\s+\d+\s*:.*)$/);
        if (m) {
          caption = m[1];
          paraBuf = [];
        }
      }
      flushPara();
      const header = splitRow(line);
      i += 2; // consomme en-tête + séparateur
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const numericCols = detectNumericCols(header.length, rows);
      blocks.push({
        type: "table",
        caption,
        header: header.map((c) => parseInline(c)),
        rows: rows.map((r) => r.map((c) => parseInline(c))),
        numericCols,
      });
      continue;
    }

    // Liste à puces : -, * (en début de ligne ou avec deux espaces de retrait)
    const bulletMatch = line.match(/^(\s*)([-*])\s+(.*)$/);
    if (bulletMatch) {
      flushPara();
      const { items, consumed } = collectList(lines, i, false);
      blocks.push({ type: "list", ordered: false, items });
      i = consumed;
      continue;
    }

    // Liste numérotée : 1. 2. ...
    const numMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (numMatch) {
      flushPara();
      const { items, consumed } = collectList(lines, i, true);
      blocks.push({ type: "list", ordered: true, items });
      i = consumed;
      continue;
    }

    // Sinon : ligne de paragraphe courante
    paraBuf.push(line.trim());
    i++;
  }
  flushPara();

  return { yaml: yamlData, blocks };
}

function isBlockStart(line) {
  return (
    /^#{2,4}\s/.test(line) ||
    /^\|/.test(line) ||
    /^```/.test(line) ||
    /^>/.test(line) ||
    /^!\[/.test(line) ||
    /^(\s*)[-*]\s/.test(line) ||
    /^(\s*)\d+\.\s/.test(line) ||
    /^\s*$/.test(line)
  );
}

function splitRow(line) {
  // Supprime le pipe de début et de fin, puis coupe sur |.
  return line
    .replace(/^\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((c) => c.trim());
}

function detectNumericCols(nCols, rows) {
  const result = new Array(nCols).fill(true);
  // Autorise : chiffres, séparateurs (espaces fine, virgule, point), unités.
  const numRe = /^[-+]?[\d  \s.,]+(?:\s?%|\s?€|\s?\$|\s?[A-Za-z]{1,4})?$/;
  for (let c = 0; c < nCols; c++) {
    let hasData = false;
    for (const row of rows) {
      const cell = (row[c] || "").trim();
      if (!cell) continue;
      hasData = true;
      if (!numRe.test(cell)) {
        result[c] = false;
        break;
      }
    }
    if (!hasData) result[c] = false;
  }
  return result;
}

function collectList(lines, start, ordered) {
  // Ramasse les items jusqu'à la première ligne vide ou qui n'est plus une puce.
  // Gère un niveau d'indentation (deux espaces = niveau 2).
  const items = [];
  let i = start;
  const marker = ordered ? /^(\s*)(\d+)\.\s+(.*)$/ : /^(\s*)([-*])\s+(.*)$/;
  let currentItem = null;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) break;
    const m = line.match(marker);
    if (m) {
      if (currentItem) items.push(currentItem);
      const indent = m[1].length;
      const level = indent >= 2 ? 1 : 0;
      currentItem = { level, text: m[3], inline: null };
      i++;
    } else if (currentItem && /^\s{2,}/.test(line)) {
      // Continuation d'item
      currentItem.text += " " + line.trim();
      i++;
    } else {
      break;
    }
  }
  if (currentItem) items.push(currentItem);
  // Finalise l'inline
  items.forEach((it) => (it.inline = parseInline(it.text)));
  return { items, consumed: i };
}

// Parse inline : **gras**, *italique*, `code`, [texte](url).
// Simple et prévisible : balaie de gauche à droite, prend le premier match.
export function parseInline(text) {
  const runs = [];
  let i = 0;
  const push = (part) => {
    if (part.text) runs.push(part);
  };
  while (i < text.length) {
    // Code inline
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end > i) {
        push({ text: text.slice(i + 1, end), code: true });
        i = end + 1;
        continue;
      }
    }
    // Gras **...**
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end > i + 1) {
        push({ text: text.slice(i + 2, end), bold: true });
        i = end + 2;
        continue;
      }
    }
    // Italique *...*
    if (text[i] === "*") {
      const end = text.indexOf("*", i + 1);
      if (end > i) {
        push({ text: text.slice(i + 1, end), italic: true });
        i = end + 1;
        continue;
      }
    }
    // Lien [texte](url)
    if (text[i] === "[") {
      const closeBracket = text.indexOf("]", i + 1);
      if (closeBracket > i && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen > closeBracket) {
          push({
            text: text.slice(i + 1, closeBracket),
            href: text.slice(closeBracket + 2, closeParen),
          });
          i = closeParen + 1;
          continue;
        }
      }
    }
    // Texte brut jusqu'au prochain marqueur
    let j = i;
    while (
      j < text.length &&
      text[j] !== "`" &&
      !(text[j] === "*" ) &&
      text[j] !== "["
    ) {
      j++;
    }
    if (j === i) j = i + 1; // avance d'au moins un caractère
    push({ text: text.slice(i, j) });
    i = j;
  }
  return runs;
}
