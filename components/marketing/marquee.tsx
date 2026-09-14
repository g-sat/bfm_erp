"use client";

import React from "react";
import Image from "next/image";

const iconPaths = [
  "/assets/website client logos png/1.png",
  "/assets/website client logos png/2.png",
  "/assets/website client logos png/3.png",
  "/assets/website client logos png/4.png",
  "/assets/website client logos png/5.png",
  "/assets/website client logos png/6.png",
  "/assets/website client logos png/7.png",
  "/assets/website client logos png/8.png",
  "/assets/website client logos png/9.png",
  "/assets/website client logos png/10.png",
  "/assets/website client logos png/11.png",
  "/assets/website client logos png/12.png",
  "/assets/website client logos png/13.png",
  "/assets/website client logos png/14.png",
  "/assets/website client logos png/15.png",
  "/assets/website client logos png/16.png",
  "/assets/website client logos png/17.png",
  "/assets/website client logos png/18.png",
  "/assets/website client logos png/19.png",
  "/assets/website client logos png/20.png",
  "/assets/website client logos png/21.png",
  "/assets/website client logos png/22.png",
  "/assets/website client logos png/23.png",
  "/assets/website client logos png/24.png",
  "/assets/website client logos png/25.png",
  "/assets/website client logos png/26.png",
  "/assets/website client logos png/27.png",
  "/assets/website client logos png/28.png",
  "/assets/website client logos png/29.png",
  "/assets/website client logos png/30.png",
  "/assets/website client logos png/31.png",
  "/assets/website client logos png/32.png",
  "/assets/website client logos png/33.png",
  "/assets/website client logos png/34.png",
  "/assets/website client logos png/35.png",
  "/assets/website client logos png/36.png",
  "/assets/website client logos png/37.png",
  "/assets/website client logos png/38.png",
  "/assets/website client logos png/39.png",
  "/assets/website client logos png/40.png",
  "/assets/website client logos png/41.png",
  "/assets/website client logos png/42.png",
  "/assets/website client logos png/43.png",
  "/assets/website client logos png/44.png",
  "/assets/website client logos png/45.png",
  "/assets/website client logos png/46.png",
  "/assets/website client logos png/47.png",
  "/assets/website client logos png/48.png",
  "/assets/website client logos png/49.png",
  "/assets/website client logos png/50.png",
];

const ICON_WIDTH = 70;
const ICON_MARGIN_TOTAL = 40; // 20px each side
const ICON_TOTAL_WIDTH = ICON_WIDTH + ICON_MARGIN_TOTAL; // 120
const SET_WIDTH = ICON_TOTAL_WIDTH * iconPaths.length; // e.g., 120 * 50 = 6000

export default function HeroMarquee({ direction = "left" }) {
  const animationName = direction === "right" ? "marqueeRight" : "marqueeLeft";
  const repeatCount = 7; // triple repeat to cover width

  // Repeat icons 3 times
  const repeatedIcons = Array(repeatCount).fill(iconPaths).flat();

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        style={{
          display: "flex",
          width: `${SET_WIDTH * repeatCount}px`,
          animation: `${animationName} 150s linear infinite`,
          whiteSpace: "nowrap",
        }}
      >
        {repeatedIcons.map((src, idx) => (
          <div
            key={idx}
            style={{
              margin: "0 20px",
              flexShrink: 0,
              position: "relative",
              width: `${ICON_WIDTH}px`,
              height: `${ICON_WIDTH}px`,
            }}
          >
            <Image
              src={src}
              alt="icon"
              fill
              style={{ objectFit: "contain" }}
              priority={idx < iconPaths.length} // Prioritize first set
              sizes={`${ICON_WIDTH}px`}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marqueeLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${SET_WIDTH}px);
          }
        }
        @keyframes marqueeRight {
          0% {
            transform: translateX(-${SET_WIDTH}px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}