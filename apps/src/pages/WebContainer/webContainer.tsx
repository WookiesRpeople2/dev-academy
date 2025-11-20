import { WebContainer } from "@webcontainer/api";
import type { FileSystemTree } from "@webcontainer/api";

let webcontainerInstance: WebContainer | null = null;

export async function initWebContainer(): Promise<WebContainer> {
  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  // Démarrer WebContainer (prend quelques secondes)
  webcontainerInstance = await WebContainer.boot();
  console.log("WebContainer démarré avec succès");

  return webcontainerInstance;
}

export function getWebContainerInstance(): WebContainer | null {
  return webcontainerInstance;
}

export async function mountFiles(
  webcontainer: WebContainer,
  filesStructure: FileSystemTree
): Promise<void> {
  await webcontainer.mount(filesStructure);
  console.log("Fichiers montés avec succès");
}

export async function installDependencies(
  webcontainer: WebContainer,
  onOutput?: (data: string) => void
): Promise<void> {
  const installProcess = await webcontainer.spawn("npm", [
    "install",
    "--no-progress", // désactive le spinner
    "--loglevel=silent", // supprime les logs parasites
  ]);

  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        if (onOutput) onOutput(data);
        console.log(data);
      },
    })
  );

  const exitCode = await installProcess.exit;

  if (exitCode !== 0) {
    throw new Error("Installation failed");
  }

  console.log("Dépendances installées");
}

export async function runCommand(
  webcontainer: WebContainer,
  command: string,
  args: string[] = [],
  onOutput?: (data: string) => void
): Promise<number> {
  const process = await webcontainer.spawn(command, args);

  // Capturer la sortie
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        if (onOutput) {
          onOutput(data);
        }
      },
    })
  );

  // Retourner le code de sortie
  return await process.exit;
}
