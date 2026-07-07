"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  businessName: string;
  slug: string;
  accentColor: string;
}

export function QRGenerator({ businessName, slug, accentColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const menuUrl = `${origin}/menu/${slug}`;

  useEffect(() => {
    if (!origin) return;
    async function generate() {
      try {
        const QRCode = (await import("qrcode")).default;
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, menuUrl, {
            width: 400,
            margin: 2,
            color: {
              dark: accentColor,
              light: "#121216",
            },
          });
        }
      } catch (e) {
        console.error("QR error:", e);
      } finally {
        setLoading(false);
      }
    }
    generate();
  }, [origin, menuUrl, accentColor]);

  function downloadPNG() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `menu-${slug}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  function downloadPDF() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL("image/png", 1.0);

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const frameColor = accentColor || "#d4a853";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Menú — ${businessName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; background: #121216; font-family: 'Inter', sans-serif;
          }
          .frame {
            background: #1c1c22;
            border: 4px solid ${frameColor};
            border-radius: 32px;
            padding: 40px;
            text-align: center;
            max-width: 480px;
          }
          .frame img {
            width: 320px; height: 320px;
            display: block; margin: 0 auto 24px;
            border-radius: 16px;
          }
          .frame h2 {
            font-family: 'Playfair Display', serif;
            font-size: 28px; color: ${frameColor};
            margin-bottom: 8px;
          }
          .frame p {
            color: #a09b94; font-size: 14px; line-height: 1.5;
          }
          .frame .scan {
            display: inline-block;
            margin-top: 16px;
            background: ${frameColor};
            color: #121216;
            padding: 10px 32px;
            border-radius: 100px;
            font-weight: 700;
            font-size: 16px;
          }
          @media print {
            body { background: white; }
            .frame { border-color: #d4a853; background: white; }
            .frame h2 { color: #b8963f; }
            .frame .scan { background: #d4a853; color: white; }
          }
        </style>
      </head>
      <body>
        <div class="frame">
          <img src="${imgData}" alt="QR Code" />
          <h2>${businessName}</h2>
          <p>Apunte su cámara al código QR<br/>para ver nuestro menú digital</p>
          <div style="margin-top: 16px;">
            <span class="scan">ESCANEA NUESTRO MENÚ</span>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-sm font-semibold text-muted">Código QR</h2>

      <div className="flex justify-center">
        <div className="overflow-hidden rounded-2xl border-2 border-line bg-[#121216] p-4">
          <canvas ref={canvasRef} className="h-48 w-48 md:h-56 md:w-56" />
        </div>
      </div>

      {loading && (
        <p className="text-center text-sm text-muted">Generando QR…</p>
      )}

      <p className="text-center text-sm text-muted break-all">
        {menuUrl}
      </p>

      <div className="flex gap-3">
        <button onClick={downloadPNG} className="btn-secondary flex-1 text-sm">
          Descargar PNG
        </button>
        <button onClick={downloadPDF} className="btn-primary flex-1 text-sm">
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
