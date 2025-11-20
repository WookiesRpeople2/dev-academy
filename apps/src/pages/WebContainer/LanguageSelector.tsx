interface LanguageSelectorProps {
  // Le type est mis à jour pour ne contenir que 'javascript' et 'rust'
  currentLanguage: "javascript" | "rust";
  onLanguageChange: (language: "javascript" | "rust") => void;
  disabled?: boolean;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  disabled,
}: LanguageSelectorProps) {
  const languages = [
    { id: "javascript" as const, name: "JavaScript" },
    // Option TypeScript retirée
    { id: "rust" as const, name: "Rust" },
  ];

  return (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      {" "}
      {/* Gap réduit pour un look plus compact */}
      {languages.map((lang) => {
        // ... (le reste du composant reste inchangé)
        const isActive = currentLanguage === lang.id;
        return (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            disabled={disabled}
            style={
              // ... (styles)
              {
                padding: "0.4rem 0.75rem",
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive
                  ? "var(--accent-foreground)"
                  : "var(--muted-foreground)",
                border: "1px solid transparent",
                borderRadius: "var(--radius-md)",
                cursor: disabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: isActive
                  ? "var(--font-weight-medium)"
                  : "var(--font-weight-normal)",
                opacity: disabled ? 0.5 : 1,
                transition: "all 0.2s",
              }
            }
          >
            <span
              style={{ fontSize: "1rem", opacity: isActive ? 1 : 0.7 }}
            ></span>
            <span>{lang.name}</span>
          </button>
        );
      })}
    </div>
  );
}
