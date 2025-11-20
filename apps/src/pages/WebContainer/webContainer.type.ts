import type { FileSystemTree } from "@webcontainer/api";

export const jsTemplate: FileSystemTree = {
  "index.js": {
    file: {
      contents: `// Exemple Day.js
// On utilise require() car le package.json est en CommonJS.
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

console.log('--- Utilisation de Day.js ---');

// 1. Obtenir la date actuelle
const now = dayjs();
console.log(\`Date actuelle : \${now.format('YYYY-MM-DD HH:mm:ss')}\`);

// 2. Ajouter 7 jours et formater (nécessite d'abord un 'npm install dayjs')
const futureDate = now.add(7, 'day');
console.log(\`Dans 7 jours, il sera : \${futureDate.format('dddd, MMMM D')}\`);

// 3. Différence avec une date passée
const pastDate = dayjs('2024-01-01');
const daysDiff = now.diff(pastDate, 'day');
console.log(\`Jours écoulés depuis le 1er janvier : \${daysDiff}\`);

// IMPORTANT: N'oubliez pas de cliquer sur "Installer Deps" avant d'exécuter ce code !
`,
    },
  },
  "package.json": {
    file: {
      contents: JSON.stringify(
        {
          name: "javascript-project",
          version: "1.0.0",
          dependencies: {
            dayjs: "^1.11.10",
          },
        },
        null,
        2
      ),
    },
  },
};

export const rustTemplate: FileSystemTree = {
  "main.rs": {
    file: {
      contents: `// Rust Example
fn main() {
    println!("Hello from Rust!");
    
    let name = "World";
    greet(name);
    
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}

fn greet(name: &str) {
    println!("Hello, {}!", name);
}
`,
    },
  },
  "Cargo.toml": {
    file: {
      contents: `[package]
name = "rust-project"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
    },
  },
  "package.json": {
    file: {
      contents: JSON.stringify(
        {
          name: "rust-project",
          version: "1.0.0",
          // Ajout du script 'start' pour la cohérence avec 'cargo run'
          scripts: {
            start: "cargo run --quiet",
          },
        },
        null,
        2
      ),
    },
  },
};
