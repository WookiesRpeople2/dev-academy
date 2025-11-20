import { useState } from "react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (path: string) => void;
  onFileCreate: (path: string, type: "file" | "folder") => void;
  onFileDelete: (path: string) => void;
  selectedFile: string;
}

export default function FileExplorer({
  files,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  selectedFile,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["/"])
  );
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [createType, setCreateType] = useState<"file" | "folder">("file");

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreate = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName.trim(), createType);
      setNewFileName("");
      setShowCreateInput(false);
    }
  };

  const renderTree = (nodes: FileNode[], parentPath: string = "") => {
    return nodes.map((node) => {
      const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
      const isExpanded = expandedFolders.has(fullPath);

      return (
        <div key={fullPath} style={{ marginLeft: parentPath ? "1rem" : "0" }}>
          <div
            style={{
              padding: "0.4rem 0.5rem",
              cursor: "pointer",
              background: selectedFile === fullPath ? "#094771" : "transparent",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "4px",
            }}
            onClick={() => {
              if (node.type === "folder") {
                toggleFolder(fullPath);
              } else {
                onFileSelect(fullPath);
              }
            }}
          >
            <span>
              {node.type === "folder" ? (isExpanded ? "📂" : "📁") : "📄"}
            </span>
            <span style={{ flex: 1, fontSize: "0.9rem" }}>{node.name}</span>
            {node.type === "file" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileDelete(fullPath);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  padding: "0.2rem",
                  fontSize: "0.8rem",
                }}
              >
                ✕
              </button>
            )}
          </div>
          {node.type === "folder" && isExpanded && node.children && (
            <div>{renderTree(node.children, fullPath)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        width: "250px",
        background: "#252526",
        borderRight: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        color: "#ccc",
      }}
    >
      <div
        style={{
          padding: "0.5rem 1rem",
          background: "#2d2d2d",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>FICHIERS</strong>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => {
              setCreateType("file");
              setShowCreateInput(true);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#ccc",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "0",
            }}
            title="Nouveau fichier"
          >
            📄+
          </button>
          <button
            onClick={() => {
              setCreateType("folder");
              setShowCreateInput(true);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#ccc",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "0",
            }}
            title="Nouveau dossier"
          >
            📁+
          </button>
        </div>
      </div>

      {showCreateInput && (
        <div style={{ padding: "0.5rem", background: "#1e1e1e" }}>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setShowCreateInput(false);
            }}
            placeholder={
              createType === "file" ? "nom-fichier.js" : "nom-dossier"
            }
            autoFocus
            style={{
              width: "100%",
              padding: "0.4rem",
              background: "#3c3c3c",
              border: "1px solid #555",
              color: "#fff",
              borderRadius: "3px",
              fontSize: "0.85rem",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              onClick={handleCreate}
              style={{
                flex: 1,
                padding: "0.3rem",
                background: "#007acc",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Créer
            </button>
            <button
              onClick={() => setShowCreateInput(false)}
              style={{
                flex: 1,
                padding: "0.3rem",
                background: "#555",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
        {renderTree(files)}
      </div>
    </div>
  );
}
