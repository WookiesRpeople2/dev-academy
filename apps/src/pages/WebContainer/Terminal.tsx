import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { WebContainer, type WebContainerProcess } from "@webcontainer/api";

interface TerminalProps {
  webcontainer: WebContainer | null;
  // Prop pour appeler l'exécution Rust
  onCargoRun?: () => Promise<void>;
}

export interface TerminalRef {
  log: (text: string, type?: "command" | "output" | "error") => void;
  attachProcess: (process: WebContainerProcess) => Promise<void>;
  clear: () => void;
}

const Terminal = forwardRef<TerminalRef, TerminalProps>(
  ({ webcontainer, onCargoRun }, ref) => {
    const [history, setHistory] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const [activeProcess, setActiveProcess] =
      useState<WebContainerProcess | null>(null);

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const processWriter = useRef<WritableStreamDefaultWriter<string> | null>(
      null
    );

    useEffect(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, [history, currentInput]);

    const log = (
      text: string,
      type: "command" | "output" | "error" = "output"
    ) => {
      if (text.trim() === "") return;

      const lines = text.split("\n");
      setHistory((prev) => {
        const newHistory = [...prev];
        lines.forEach((line) => {
          let color = "#cccccc";
          if (type === "command") color = "#4ec9b0";
          if (type === "error") color = "#f44747";
          newHistory.push(`<div style="color:${color}">${line}</div>`);
        });
        return newHistory;
      });
    };

    useImperativeHandle(ref, () => ({
      log: (text, type) => log(text, type),
      attachProcess: async (process) => attachProcess(process),
      clear: () => setHistory([]),
    }));

    const attachProcess = async (process: WebContainerProcess) => {
      setActiveProcess(process);

      processWriter.current = process.input.getWriter();

      process.output.pipeTo(
        new WritableStream({
          write(data) {
            log(data);
          },
        })
      );

      const exitCode = await process.exit;
      setActiveProcess(null);
      processWriter.current = null;
      log(
        `\nProcessus terminé avec le code: ${exitCode}\n`,
        exitCode !== 0 ? "error" : "output"
      );
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && webcontainer && !activeProcess) {
        e.preventDefault();
        const command = currentInput.trim();
        if (!command) return;

        // Ajouter la commande à l'historique d'affichage (avec prompt simulé)
        setHistory((prev) => [
          ...prev,
          `<span style="color:#4ec9b0;">$</span> ${command}`,
        ]);
        setCommandHistory([
          command,
          ...commandHistory.filter((c) => c !== command),
        ]);
        setHistoryIndex(-1);
        setCurrentInput("");

        // --- NOUVELLE LOGIQUE D'INTERCEPTION ROBUSTE POUR CARGO ---
        // Intercepte toutes les commandes 'cargo' pour éviter l'erreur "command not found" (code 127)
        if (command.startsWith("cargo") && onCargoRun) {
          // Si l'utilisateur tape "cargo" ou "cargo run", on lance l'exécution externe
          if (command.trim() === "cargo run" || command.trim() === "cargo") {
            log(`\nLancement de 'cargo run' via l'API Rust Playground...`);
            await onCargoRun();
          } else {
            // Pour toute autre commande (cargo install, cargo test, etc.)
            log(
              `\n⚠️ La commande 'cargo' n'est pas disponible dans ce WebContainer.`
            );
            log(
              `Veuillez utiliser le bouton "Exécuter" ou taper "cargo run" pour lancer votre code.\n`,
              "error"
            );
          }
          return; // ARRÊTER ICI l'exécution pour empêcher le WebContainer de chercher la commande
        }
        // --- FIN DE L'INTERCEPTION ---

        // Logique existante pour les commandes WebContainer (npm, node, etc.)
        try {
          const [cmd, ...args] = command.split(" ");
          const process = await webcontainer.spawn(cmd, args);
          await attachProcess(process);
        } catch (error) {
          // Ce bloc ne devrait plus être atteint pour 'cargo'
          log(`\n❌ Commande inconnue: ${command}\n`, "error");
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = Math.min(
            historyIndex + 1,
            commandHistory.length - 1
          );
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentInput("");
        }
      } else if (activeProcess && processWriter.current) {
        processWriter.current.write(e.key);
        e.preventDefault();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!activeProcess) {
        setCurrentInput(e.target.value);
      }
    };

    return (
      <div
        onClick={() => inputRef.current?.focus()}
        ref={terminalRef}
        style={{
          flex: 1,
          fontFamily: 'Consolas, "Courier New", monospace',
          fontSize: "14px",
          padding: "1rem",
          background: "#1e1e1e",
          color: "#cccccc",
          overflowY: "auto",
          cursor: "text",
          lineHeight: "1.5",
        }}
      >
        {history.map((line, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
        ))}

        <div style={{ display: "flex", alignItems: "center" }}>
          {!activeProcess && (
            <span style={{ color: "#4ec9b0", marginRight: "0.5rem" }}>$</span>
          )}

          <input
            ref={inputRef}
            type="text"
            value={activeProcess ? "" : currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={!webcontainer}
            autoFocus
            autoComplete="off"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#cccccc",
              fontFamily: "inherit",
              fontSize: "inherit",
              outline: "none",
              padding: 0,
            }}
          />
        </div>
      </div>
    );
  }
);

export default Terminal;
