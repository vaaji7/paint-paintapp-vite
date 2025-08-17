import React, { useRef, useState, useEffect } from "react";

export default function PaintApp() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const [color, setColor] = useState("#111827");
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  function getPointerPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDrawing(e) {
    e.preventDefault();
    drawingRef.current = true;
    const pos = getPointerPos(e);
    lastPosRef.current = pos;
  }

  function stopDrawing(e) {
    e && e.preventDefault();
    drawingRef.current = false;
  }

  function draw(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = ctxRef.current;
    const pos = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isEraser ? "#ffffff" : color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
    lastPosRef.current = pos;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }

  function saveImage() {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "painting.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Simple Paint App</h1>

        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-2 bg-gray-100 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm">Brush</label>
                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-40"
                  />
                  <span className="text-sm w-8 text-right">{brushSize}</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm">Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-8 w-10 p-0 border-0"
                  />
                </div>

                <button
                  onClick={() => setIsEraser((s) => !s)}
                  className={`px-3 py-1 rounded ${isEraser ? "bg-red-100" : "bg-gray-100"}`}
                >
                  {isEraser ? "Eraser On" : "Eraser Off"}
                </button>

                <button onClick={clearCanvas} className="px-3 py-1 rounded bg-gray-100">
                  Clear
                </button>

                <button onClick={saveImage} className="px-3 py-1 rounded bg-gray-100">
                  Save PNG
                </button>
              </div>

              <div className="w-full h-[60vh] md:h-[60vh] touch-none">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full bg-white block touch-pan-y"
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchCancel={stopDrawing}
                  onTouchMove={draw}
                />
              </div>
            </div>
          </div>

          <aside className="w-full md:w-56 p-2">
            <div className="mb-4">
              <h2 className="text-sm font-medium">Quick colors</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "#111827",
                  "#ef4444",
                  "#f59e0b",
                  "#facc15",
                  "#10b981",
                  "#3b82f6",
                  "#7c3aed",
                  "#ffffff",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      setIsEraser(false);
                    }}
                    className="h-8 w-8 rounded"
                    style={{ background: c, border: c === "#ffffff" ? "1px solid #e5e7eb" : "none" }}
                    aria-label={`color-${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">Tips:</p>
              <ul className="list-disc pl-5">
                <li>Use mouse or touch to draw.</li>
                <li>Try larger brush sizes for bold strokes.</li>
                <li>Use Save to download your painting as PNG.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
