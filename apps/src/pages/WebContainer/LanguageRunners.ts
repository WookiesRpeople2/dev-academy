import { WebContainer, type WebContainerProcess } from "@webcontainer/api";

export interface RunResult {
  process?: WebContainerProcess;
  output?: string;
  error?: string;
}

type LogCallback = (
  output: string,
  type?: "output" | "error" | "command"
) => void;

export async function runJavaScript(
  webcontainer: WebContainer,
  filename: string,
  onOutput: LogCallback
): Promise<RunResult> {
  try {
    onOutput(`$ node ${filename}\n`, "command");
    const process = await webcontainer.spawn("node", [filename]);
    return { process };
  } catch (error) {
    const errorMsg = `❌ Erreur de lancement: ${error}\n`;
    onOutput(errorMsg, "error");
    return { error: String(error) };
  }
}

// --- Fonction runRust mise à jour ---
export async function runRust(
  webcontainer: WebContainer,
  filename: string,
  onOutput: LogCallback
): Promise<RunResult> {
  try {
    // Affichage de la commande demandée par l'utilisateur
    onOutput(`$ cargo run\n`, "command");

    // Message informatif expliquant l'exécution externe
    onOutput(
      "⚠️ Rust Toolchain (Cargo) non disponible dans le WebContainer.\n🦀 Exécution du code via l'API Rust Playground...\n",
      "output"
    );

    // 1. Lire le contenu du fichier
    const code = await webcontainer.fs.readFile(filename, "utf-8");

    // 2. Appeler l'API officielle Rust Playground
    const response = await fetch("https://play.rust-lang.org/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "stable",
        mode: "debug",
        edition: "2021",
        // Nous lisons le code de main.rs, donc on utilise le type bin
        crateType: "bin",
        tests: false,
        code: code,
        backtrace: false,
      }),
    });

    const result = await response.json();

    // 3. Traiter le résultat
    let outputLog = "";

    if (result.success) {
      if (result.stderr && result.stderr.trim()) {
        onOutput(result.stderr + "\n", "output");
      }
      onOutput(result.stdout + "\n", "output");
      outputLog = result.stdout;
    } else {
      // Erreur de compilation (affichée par le serveur Rust)
      onOutput(result.stderr + "\n", "error");
      return { error: result.stderr };
    }

    onOutput("\n✓ Exécution Rust terminée\n", "output");
    return { output: outputLog };
  } catch (error) {
    const errorMsg = `❌ Erreur API Rust: ${error}\nVérifiez votre connexion internet.\n`;
    onOutput(errorMsg, "error");
    return { error: String(error) };
  }
}
