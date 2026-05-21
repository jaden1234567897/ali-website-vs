import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// Brushed metallic gradient used for the silver coin rim/edge
const METAL_GRADIENT =
  "linear-gradient(180deg, #1a1a1a 0%, #4a4a4a 8%, #828282 18%, #b8b8b8 30%, #e6e6e6 42%, #f6f6f6 50%, #d6d6d6 58%, #a0a0a0 70%, #6a6a6a 82%, #2a2a2a 92%, #0d0d0d 100%)";

// Subtle gradient used to suggest the inner face of the angled coins
const FACE_GRADIENT =
  "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)";

type CoinProps = {
  width: number;
  height: number;
  top: string;
  left: string;
  rotate?: number;
  floatY?: number;
  floatX?: number;
  scale?: number;
  zIndex?: number;
  opacity?: number;
};

const Coin: React.FC<CoinProps> = ({
  width,
  height,
  top,
  left,
  rotate = 0,
  floatY = 0,
  floatX = 0,
  scale = 1,
  zIndex = 3,
  opacity = 1,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        transform: `translate(-50%, -50%) translate(${floatX}px, ${floatY}px) rotate(${rotate}deg) scale(${scale})`,
        borderRadius: "50%",
        background: METAL_GRADIENT,
        boxShadow:
          "0 40px 70px rgba(0,0,0,0.65), 0 12px 20px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)",
        zIndex,
        opacity,
      }}
    >
      {/* Face sheen overlay for a hint of 3D form */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: FACE_GRADIENT,
          mixBlendMode: "screen",
        }}
      />
      {/* Specular highlight stripe */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "12%",
          right: "12%",
          height: "14%",
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
          filter: "blur(2px)",
          opacity: 0.85,
        }}
      />
      {/* Bottom rim shadow band */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "10%",
          right: "10%",
          height: "10%",
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)",
          filter: "blur(3px)",
        }}
      />
    </div>
  );
};

// Center text used for the three pillar reveals
const PillarText: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
}> = ({ text, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame - 5 || frame > endFrame + 5) return null;

  const local = frame - startFrame;
  const total = endFrame - startFrame;

  const opacity = interpolate(
    local,
    [0, 18, total - 25, total],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const blur = interpolate(local, [0, 22], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const letterSpacing = interpolate(local, [0, 30], [10, -4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yOff = interpolate(local, [0, 30], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translateY(${yOff}px)`,
        color: "#f3f3f3",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        fontSize: 165,
        fontWeight: 700,
        letterSpacing,
        textAlign: "center",
        opacity,
        filter: `blur(${blur}px)`,
        textShadow: "0 8px 50px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.6)",
        zIndex: 2,
        whiteSpace: "nowrap",
        textTransform: "none",
      }}
    >
      {text}
    </div>
  );
};

// Bottom-left rotating caption that matches each pillar
const Caption: React.FC<{
  frame: number;
}> = ({ frame }) => {
  // Caption text changes per pillar
  let label = "BRIDGING THE GAP";
  let body = "Strategy, governance, and execution align as one operating system.";

  if (frame >= 90 && frame < 210) {
    label = "STRATEGY";
    body = "Boardroom clarity. Annual planning. AI-assisted frameworks.";
  } else if (frame >= 210 && frame < 330) {
    label = "GOVERNANCE";
    body = "Accountability structures and decision rights that hold the line.";
  } else if (frame >= 330 && frame < 450) {
    label = "EXECUTION";
    body = "From slide to outcome — measurable delivery in the real world.";
  } else if (frame >= 450) {
    label = "WORK WITH ALÍ";
    body = "Advisory · Self-paced course · 1:1 consultations.";
  }

  // Cross-fade between caption changes
  const transitionPoints = [0, 90, 210, 330, 450];
  let segStart = 0;
  for (const p of transitionPoints) if (frame >= p) segStart = p;
  const local = frame - segStart;
  const segOp = interpolate(local, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 95,
        left: 110,
        zIndex: 12,
        maxWidth: 460,
        opacity: segOp,
        transition: "opacity 0.4s",
      }}
    >
      <div
        style={{
          color: "#666",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 5,
          marginBottom: 14,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#c8c8c8",
          fontSize: 20,
          fontWeight: 400,
          lineHeight: 1.55,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {body}
      </div>
    </div>
  );
};

export const AliDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Coin entrance: starts at frame 20, spring up + scale
  const entrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 95, mass: 1 },
  });
  const coinOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const coinEntryScale = interpolate(entrance, [0, 1], [0.55, 1]);
  const coinEntryY = interpolate(entrance, [0, 1], [80, 0]);

  // Brand fade-in
  const brandOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slow gentle float for each coin (independent phase)
  const t = frame / 30;
  const floatTopY = Math.sin(t * 0.9) * 7;
  const floatLeftY = Math.sin(t * 0.9 + 1.4) * 9;
  const floatLeftX = Math.cos(t * 0.7 + 0.6) * 4;
  const floatRightY = Math.sin(t * 0.9 + 2.7) * 9;
  const floatRightX = Math.cos(t * 0.7 + 1.9) * 4;

  // Slow "breathing" rotation on side coins
  const sideRotateBoost = Math.sin(t * 0.4) * 1.5;

  // Closing zoom-in to text (frame 450+)
  const closingProgress = interpolate(frame, [450, 530], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coinClosingScale = interpolate(closingProgress, [0, 1], [1, 1.15]);
  const coinClosingOpacity = interpolate(
    closingProgress,
    [0, 1],
    [1, 0.35]
  );

  // URL fade-in at very end
  const urlOpacity = interpolate(frame, [510, 545], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final overall fade-out
  const finalFade = interpolate(frame, [660, 690], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 55%, #0c0c0f 0%, #050507 65%, #000 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
        opacity: finalFade,
      }}
    >
      {/* Soft vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Top-left brand mark */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 110,
          opacity: brandOpacity,
          zIndex: 15,
        }}
      >
        <div
          style={{
            color: "#f0f0f0",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Alí Al-Alí
        </div>
        <div
          style={{
            color: "#7a7a7a",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 5,
            marginTop: 5,
          }}
        >
          STRATEGY · EXECUTION
        </div>
      </div>

      {/* Top-right nav */}
      <div
        style={{
          position: "absolute",
          top: 72,
          right: 110,
          display: "flex",
          gap: 44,
          opacity: brandOpacity * 0.85,
          zIndex: 15,
        }}
      >
        {["About", "Course", "Advisory", "Process", "Contact"].map((l) => (
          <div
            key={l}
            style={{
              color: "#b8b8b8",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: 0.3,
            }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* Faint dashed orbit ellipse behind the coins */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${coinEntryScale * coinClosingScale})`,
          width: 780,
          height: 290,
          borderRadius: "50%",
          border: "1px dashed rgba(255,255,255,0.07)",
          opacity: coinOpacity * 0.9 * coinClosingOpacity,
          zIndex: 1,
        }}
      />

      {/* Compass dots around the orbit (top/right/bottom/left) */}
      {[
        { x: 0, y: -145 },
        { x: 390, y: 0 },
        { x: 0, y: 145 },
        { x: -390, y: 0 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(200,200,200,0.55)",
            transform: `translate(-50%, -50%) translate(${p.x * coinEntryScale * coinClosingScale}px, ${p.y * coinEntryScale * coinClosingScale}px)`,
            opacity: coinOpacity * coinClosingOpacity,
            zIndex: 1,
          }}
        />
      ))}

      {/* Center pillar text (behind coins for the masked-letter effect) */}
      <PillarText text="Strategy" startFrame={90} endFrame={210} />
      <PillarText text="Governance" startFrame={210} endFrame={330} />
      <PillarText text="Execution" startFrame={330} endFrame={450} />

      {/* Closing message (replaces pillar text after frame 450) */}
      {frame >= 450 && (
        <ClosingMessage frame={frame - 450} urlOpacity={urlOpacity} />
      )}

      {/* Coin trio — slightly above pillar text z-index so letters get masked at the sides */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${coinEntryScale * coinClosingScale})`,
          transformOrigin: "50% 55%",
          opacity: coinOpacity * coinClosingOpacity,
          zIndex: 3,
        }}
      >
        {/* Top coin — edge-on */}
        <Coin
          width={420}
          height={50}
          top="34%"
          left="50%"
          floatY={floatTopY + coinEntryY * 0.5}
          zIndex={4}
        />
        {/* Bottom-left coin */}
        <Coin
          width={360}
          height={120}
          top="64%"
          left="35%"
          rotate={-24 + sideRotateBoost}
          floatY={floatLeftY + coinEntryY * 0.8}
          floatX={floatLeftX}
          zIndex={4}
        />
        {/* Bottom-right coin */}
        <Coin
          width={360}
          height={120}
          top="64%"
          left="65%"
          rotate={24 - sideRotateBoost}
          floatY={floatRightY + coinEntryY * 0.8}
          floatX={floatRightX}
          zIndex={4}
        />
      </div>

      {/* Bottom-left caption */}
      <Caption frame={frame} />

      {/* Bottom-right URL — appears in closing */}
      <div
        style={{
          position: "absolute",
          bottom: 95,
          right: 110,
          zIndex: 15,
          color: "#22d3ee",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: 1,
          opacity: urlOpacity,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        aliiweb.vercel.app →
      </div>

      {/* Bottom-right tiny mark — always visible */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 30,
          color: "#444",
          fontSize: 16,
          fontWeight: 700,
          opacity: brandOpacity,
          fontFamily: "serif",
          zIndex: 15,
        }}
      >
        N
      </div>
    </AbsoluteFill>
  );
};

const ClosingMessage: React.FC<{ frame: number; urlOpacity: number }> = ({
  frame,
}) => {
  const opacity = interpolate(frame, [0, 30, 210, 240], [0, 1, 1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yOff = interpolate(frame, [0, 35], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [40, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translateY(${yOff}px)`,
        textAlign: "center",
        opacity,
        zIndex: 2,
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#f5f5f5",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -3,
          lineHeight: 1.05,
          textShadow: "0 8px 50px rgba(0,0,0,0.85)",
        }}
      >
        Where Strategy
        <br />
        Meets Execution.
      </div>
      <div
        style={{
          marginTop: 32,
          color: "#9a9a9a",
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: 5,
          fontFamily: "'Inter', system-ui, sans-serif",
          opacity: subOpacity,
        }}
      >
        ADVISORY · COURSE · 1:1 CONSULTATIONS
      </div>
    </div>
  );
};
