"use client";

import { useEffect, useState } from "react";

export function PublicLinkCard({ slug }: { slug: string }) {
  const path = `/menu/${slug}`;
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // El portapapeles puede no estar disponible (http, permisos); el enlace sigue visible.
    }
  }

  return (
    <div className="card space-y-2">
      <h2 className="text-sm font-semibold text-muted">Tu menú público</h2>
      <p className="text-sm text-ink">Comparte este enlace con tus clientes:</p>
      <div className="flex items-center gap-2">
        <a
          href={path}
          target="_blank"
          className="block min-w-0 flex-1 break-all rounded-xl bg-brand/10 px-3 py-2 text-sm font-medium text-brand"
        >
          {url}
        </a>
        <button
          onClick={copy}
          className="btn-secondary shrink-0 text-sm"
          type="button"
        >
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
    </div>
  );
}
