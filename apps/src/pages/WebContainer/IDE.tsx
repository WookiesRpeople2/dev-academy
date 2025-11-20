import { useState, useEffect, useRef } from "react";
import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import {
  initWebContainer,
  mountFiles,
  installDependencies,
} from "./webContainer";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import Terminal, { type TerminalRef } from "./Terminal";
import LanguageSelector from "./LanguageSelector";
import { jsTemplate, rustTemplate } from "./webContainer.type";
import { runJavaScript, runRust } from "./LanguageRunners";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface OpenFile {
  path: string;
  content: string;
  language: string;
}

// Type 'typescript' retiré
type Language = "javascript" | "rust";

export default function IDE() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLanguage, setCurrentLanguage] =
    useState<Language>("javascript");

  // Référence vers le terminal pour contrôler l'affichage et les processus
  const terminalRef = useRef<TerminalRef>(null);

  // Gestion des fichiers
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [currentFile, setCurrentFile] = useState<string>("");

  // Helper pour écrire dans le terminal via la ref
  const addToTerminal = (
    output: string,
    type: "output" | "error" | "command" = "output"
  ) => {
    terminalRef.current?.log(output, type);
  };

  useEffect(() => {
    async function init() {
      try {
        const container = await initWebContainer();
        setWebcontainer(container);

        setTimeout(() => {
          addToTerminal("✓ WebContainer initialisé\n");
          addToTerminal("Sélectionnez un langage pour commencer\n\n");
        }, 100);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    init();
  }, []);

  const loadLanguageTemplate = async (language: Language) => {
    if (!webcontainer) return;

    try {
      setIsLoading(true);
      addToTerminal(`\n📦 Chargement du template ${language}...\n`);

      // Nettoyer l'ancien projet
      setOpenFiles([]);
      setFileTree([]);

      let template: any;
      let mainFile: string;
      let newFileTree: FileNode[];

      switch (language) {
        case "javascript":
          template = jsTemplate;
          mainFile = "index.js";
          newFileTree = [
            { name: "index.js", type: "file" },
            { name: "package.json", type: "file" },
          ];
          break;
        case "rust":
          template = rustTemplate;
          mainFile = "main.rs";
          newFileTree = [
            { name: "main.rs", type: "file" },
            { name: "Cargo.toml", type: "file" },
            { name: "package.json", type: "file" },
          ];
          break;
      }

      await mountFiles(webcontainer, template);
      setFileTree(newFileTree);

      addToTerminal(`✓ Template chargé\n`);

      // Ouvrir le fichier principal
      await openFile(mainFile, webcontainer);

      setCurrentLanguage(language);
      setIsLoading(false);

      addToTerminal(`✓ Prêt à coder en ${language}\n\n`);
    } catch (error) {
      addToTerminal(`❌ Erreur: ${error}\n`, "error");
      setIsLoading(false);
    }
  };

  const getLanguageFromPath = (path: string): string => {
    const ext = path.split(".").pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "javascript",
      rs: "rust",
      json: "json",
      toml: "toml",
      html: "html",
      css: "css",
      md: "markdown",
    };
    return languageMap[ext || ""] || "plaintext";
  };

  const openFile = async (path: string, container?: WebContainer) => {
    const wc = container || webcontainer;
    if (!wc) return;

    try {
      const existingFile = openFiles.find((f) => f.path === path);
      if (existingFile) {
        setCurrentFile(path);
        return;
      }

      const content = await wc.fs.readFile(path, "utf-8");

      const newFile: OpenFile = {
        path,
        content,
        language: getLanguageFromPath(path),
      };

      setOpenFiles((prev) => [...prev, newFile]);
      setCurrentFile(path);
    } catch (error) {
      addToTerminal(
        `❌ Erreur lors de l'ouverture de ${path}: ${error}\n`,
        "error"
      );
    }
  };

  const handleFileCreate = async (name: string, type: "file" | "folder") => {
    if (!webcontainer) return;

    try {
      if (type === "file") {
        await webcontainer.fs.writeFile(name, "");
        setFileTree((prev) => [...prev, { name, type: "file" }]);
        await openFile(name);
        addToTerminal(`✓ Fichier créé: ${name}\n`);
      } else {
        await webcontainer.fs.mkdir(name, { recursive: true });
        setFileTree((prev) => [
          ...prev,
          { name, type: "folder", children: [] },
        ]);
        addToTerminal(`✓ Dossier créé: ${name}\n`);
      }
    } catch (error) {
      addToTerminal(`❌ Erreur: ${error}\n`, "error");
    }
  };

  const handleFileDelete = async (path: string) => {
    if (!webcontainer) return;

    try {
      await webcontainer.fs.rm(path);
      setOpenFiles((prev) => prev.filter((f) => f.path !== path)); // Fermer l'onglet
      setFileTree((prev) => prev.filter((f) => f.name !== path)); // Supprimer de l'explorateur

      // Si le fichier supprimé était actif, passer au premier fichier ouvert
      if (currentFile === path) {
        const remainingFiles = openFiles.filter((f) => f.path !== path);
        if (remainingFiles.length > 0) {
          setCurrentFile(remainingFiles[0].path);
        } else {
          setCurrentFile(""); // Plus de fichiers ouverts
        }
      }

      addToTerminal(`✓ Fichier supprimé: ${path}\n`);
    } catch (error) {
      addToTerminal(`❌ Erreur: ${error}\n`, "error");
    }
  };

  const handleCodeChange = async (value: string | undefined) => {
    if (!value || !webcontainer) return;

    setOpenFiles((prev) =>
      prev.map((f) => (f.path === currentFile ? { ...f, content: value } : f))
    );

    try {
      await webcontainer.fs.writeFile(currentFile, value);
    } catch (error) {
      console.error("Erreur d'écriture:", error);
    }
  };

  const handleInstallDependencies = async () => {
    // Suppression de '|| currentLanguage === "rust"' dans le disabled prop du bouton JSX
    if (!webcontainer || isRunning || isLoading) return;

    setIsRunning(true);

    addToTerminal(
      `\n--- Installation des dépendances pour ${currentLanguage} ---\n`,
      "command"
    );

    try {
      if (currentLanguage === "javascript") {
        addToTerminal(`$ npm install\n`, "command");
        await installDependencies(webcontainer, (data) =>
          addToTerminal(data, "output")
        );
        addToTerminal(`\n✓ Installation NPM terminée.\n`, "output");
      } else if (currentLanguage === "rust") {
        // --- LOGIQUE SIMULÉE POUR RUST ---
        addToTerminal(`$ cargo install --path .\n`, "command");

        // Simulation d'une attente pour l'effet d'installation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        addToTerminal(
          "⚠️ Toolchain Rust (Cargo) absente du WebContainer.\nL'installation de dépendances 'cargo' locales n'est pas possible.\nLe code est exécuté via l'API Rust Playground (externe).\n",
          "error"
        );
        // --- FIN LOGIQUE SIMULÉE ---
      } else {
        addToTerminal(
          `Aucune commande d'installation définie pour ce langage.\n`,
          "error"
        );
      }
    } catch (error) {
      addToTerminal(`\n❌ Échec de l'installation : ${error}\n`, "error");
    } finally {
      setIsRunning(false);
    }
  };

  // --- NOUVELLE FONCTION : Logique d'exécution Rust (pour le bouton et le terminal) ---
  const runRustCode = async () => {
    if (!webcontainer || isRunning || !currentFile || !terminalRef.current)
      return;

    try {
      setIsRunning(true);
      const logWrapper = (
        text: string,
        type?: "output" | "error" | "command"
      ) => addToTerminal(text, type);

      if (currentLanguage === "javascript") {
        logWrapper(`\n--- Exécution de ${currentFile} ---\n`, "command");
        const result = await runJavaScript(
          webcontainer,
          currentFile || "index.js",
          logWrapper
        );
        if (result && "process" in result && result.process) {
          await terminalRef.current.attachProcess(
            result.process as WebContainerProcess
          );
        } else if (result?.output) {
          addToTerminal(result.output);
        }
      } else if (currentLanguage === "rust") {
        // runRust affiche déjà la commande '$ cargo run' et le message d'info API
        const result = await runRust(
          webcontainer,
          currentFile || "main.rs",
          logWrapper
        );
        if (result?.output) {
          addToTerminal(result.output);
        }
      }
    } catch (error) {
      addToTerminal(`\n❌ Erreur critique: ${error}\n`, "error");
    } finally {
      setIsRunning(false);
    }
  };

  // Fonction wrapper pour le terminal
  const runRustFromTerminal = async () => {
    if (currentLanguage !== "rust") {
      addToTerminal(
        `\nLa commande 'cargo run' est uniquement supportée en mode Rust.\n`,
        "error"
      );
      return;
    }
    if (isRunning) {
      addToTerminal(
        `\nUne exécution est déjà en cours. Veuillez attendre.\n`,
        "error"
      );
      return;
    }
    // Appel à la fonction qui contient la logique d'exécution Rust
    await runRustCode();
  };

  const handleRunCode = async () => {
    // Pour le bouton, on utilise la même fonction si c'est Rust ou JS
    await runRustCode();
  };
  // --- FIN NOUVELLE LOGIQUE D'EXÉCUTION ---

  const currentFileObj = openFiles.find((f) => f.path === currentFile);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#1e1e1e",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #333",
          background: "#2d2d2d",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0, color: "#fff", fontSize: "1.5rem" }}>
          Multi-Language IDE
        </h1>

        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={loadLanguageTemplate}
          disabled={isLoading}
        />

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          {/* BOUTON : Installer les dépendances */}
          <button
            onClick={handleInstallDependencies}
            // MODIFICATION APPLIQUÉE ICI : 'currentLanguage === "rust"' est retiré
            disabled={isLoading || !webcontainer || isRunning}
            style={{
              height: "36px",
              padding: "0 1rem",
              // La couleur/opacité dépend maintenant de l'état de chargement/exécution uniquement
              cursor: isLoading || isRunning ? "not-allowed" : "pointer",
              background: "transparent",
              border: "1px solid #555",
              color: "#ccc",
              borderRadius: "4px",
              fontWeight: "500",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
              opacity: isLoading || isRunning ? 0.5 : 1,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Le label reste 'cargo install' pour le mode Rust */}
            {currentLanguage === "javascript"
              ? "📦 npm install"
              : "cargo install"}
          </button>

          {/* BOUTON EXÉCUTER */}
          <button
            onClick={handleRunCode}
            disabled={isLoading || !webcontainer || isRunning || !currentFile}
            style={{
              height: "36px",
              padding: "0 1rem",
              cursor:
                isLoading || isRunning || !currentFile
                  ? "not-allowed"
                  : "pointer",
              background: isRunning ? "#444" : "#4ec9b0",
              color: isRunning ? "#888" : "#1e1e1e",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
            }}
          >
            {isLoading ? (
              <span style={{ fontSize: "0.8rem" }}>Chargement...</span>
            ) : isRunning ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Arrêter</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Exécuter</span>
              </>
            )}
          </button>
        </div>

        {!isLoading && webcontainer && (
          <span
            style={{
              color: "#4ec9b0",
              fontSize: "0.9rem",
            }}
          >
            ✓ Prêt
          </span>
        )}
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* File Explorer */}
        {fileTree.length > 0 && (
          <FileExplorer
            files={fileTree}
            onFileSelect={(path) => openFile(path)}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
            selectedFile={currentFile}
          />
        )}

        {/* Éditeur */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #333",
          }}
        >
          {openFiles.length > 0 ? (
            <>
              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  background: "#252526",
                  borderBottom: "1px solid #333",
                  overflowX: "auto",
                }}
              >
                {openFiles.map((file) => (
                  <div
                    key={file.path}
                    onClick={() => setCurrentFile(file.path)}
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        currentFile === file.path ? "#1e1e1e" : "transparent",
                      color: "#ccc",
                      cursor: "pointer",
                      borderRight: "1px solid #333",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.language === "rust" ? "🦀" : "📄"}
                    {file.path}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete(file.path);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#999",
                        cursor: "pointer",
                        padding: "0 0.2rem",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor */}
              {currentFileObj && (
                <CodeEditor
                  value={currentFileObj.content}
                  onChange={handleCodeChange}
                  language={currentFileObj.language}
                />
              )}
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                gap: "1rem",
              }}
            >
              <div style={{ fontSize: "3rem" }}>👋</div>
              <div style={{ fontSize: "1.2rem" }}>
                Bienvenue dans l'IDE Multi-Language
              </div>
              <div>Sélectionnez un langage ci-dessus pour commencer</div>
            </div>
          )}
        </div>

        {/* Terminal Interactif */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: "40%",
            minWidth: "300px",
          }}
        >
          <div
            style={{
              padding: "0.5rem 1rem",
              background: "#252526",
              color: "#ccc",
              fontSize: "0.9rem",
              borderBottom: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>💻 Terminal</span>
            <span style={{ fontSize: "0.75rem", color: "#666" }}>
              Interactive Shell
            </span>
          </div>

          <Terminal
            ref={terminalRef}
            webcontainer={webcontainer}
            onCargoRun={runRustFromTerminal}
          />
        </div>
      </div>
    </div>
  );
}
