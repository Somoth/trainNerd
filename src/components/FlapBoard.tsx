"use client";

import { useEffect, useRef } from "react";

export function FlapBoard({ word }: { word: string }) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const timeouts: number[] = [];

    const chars = word.split("").map((ch) => {
      const flap = document.createElement("div");
      flap.className = "flap";
      const span = document.createElement("span");
      span.className = "flap-char";
      span.textContent = reduced ? ch : "";
      flap.appendChild(span);
      board.appendChild(flap);
      return { flap, span, target: ch };
    });

    if (reduced) {
      return () => {
        board.innerHTML = "";
      };
    }

    chars.forEach((c, i) => {
      const steps = 5 + Math.floor(Math.random() * 4);
      const delay = i * 70;
      let tick = 0;

      const loop = () => {
        c.flap.classList.remove("flip");
        void c.flap.offsetWidth;
        c.flap.classList.add("flip");

        timeouts.push(
          window.setTimeout(() => {
            tick++;
            if (tick >= steps) {
              c.span.textContent = c.target;
            } else {
              c.span.textContent = pool[Math.floor(Math.random() * pool.length)];
              timeouts.push(window.setTimeout(loop, 90));
            }
          }, 55),
        );
      };

      timeouts.push(window.setTimeout(loop, delay));
    });

    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
      board.innerHTML = "";
    };
  }, [word]);

  return <div className="flapboard" ref={boardRef} aria-label={word} />;
}
