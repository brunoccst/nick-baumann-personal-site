import styles from './Blueprint.module.scss';

/**
 * The decorative backdrop: an exploded mechatronic assembly drawn as a
 * technical blueprint.
 *
 * Everything is stroked in `var(--color-blueprint-line)` and nothing is
 * filled, so the drawing follows the theme without a second copy. It is
 * purely decorative — `aria-hidden` keeps it out of the accessibility tree,
 * and the stylesheet fixes it behind the page and dims it on narrow screens
 * where the text column would otherwise sit on top of the busiest part.
 *
 * Gear teeth, rotor windings and encoder slots are dashed strokes on circles
 * rather than individually drawn segments: one attribute instead of dozens of
 * hand-placed lines, and the spacing stays even at any scale.
 */
export function Blueprint() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <svg
        className={styles.drawing}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
        stroke="var(--color-blueprint-line)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        focusable="false"
      >
        <defs>
          {/*
            Fades the drawing out towards the left, so it never runs underneath
            the text column. A luminance mask: black hides, white shows.
          */}
          <linearGradient id="blueprint-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.30" stopColor="#000000" />
            <stop offset="0.58" stopColor="#5a5a5a" />
            <stop offset="0.80" stopColor="#ffffff" />
          </linearGradient>
          <mask id="blueprint-mask">
            <rect width="1200" height="800" fill="url(#blueprint-fade)" />
          </mask>
        </defs>

        <g mask="url(#blueprint-mask)">
        {/* ---------- exploded drive assembly, on a raked axis ---------- */}
        <g transform="rotate(-27 620 330)">
          {/* shaft centre line */}
          <path d="M60 330 H1180" strokeDasharray="18 6 3 6" opacity="0.55" />

          {/* 01 — impeller */}
          <g transform="translate(120 330)">
            <circle r="44" />
            <circle r="14" />
            <circle r="30" strokeDasharray="4 9" strokeWidth="16" opacity="0.5" />
            <path d="M-44 0 H-70" opacity="0.6" />
          </g>

          {/* 02 — coupling */}
          <g transform="translate(250 330)">
            <circle r="26" />
            <circle r="9" />
            <circle r="18" strokeDasharray="3 8" strokeWidth="6" opacity="0.6" />
          </g>

          {/* 03 — bearing */}
          <g transform="translate(360 330)">
            <circle r="38" />
            <circle r="30" />
            <circle r="17" />
            <circle r="23.5" strokeDasharray="5 10" strokeWidth="11" opacity="0.55" />
          </g>

          {/* 04 — rotor with windings */}
          <g transform="translate(510 330)">
            <rect x="-70" y="-52" width="140" height="104" rx="6" />
            <circle r="46" />
            <circle r="34" strokeDasharray="6 7" strokeWidth="20" opacity="0.4" />
            <circle r="12" />
            <path d="M-70 -52 L70 52 M-70 52 L70 -52" opacity="0.25" />
          </g>

          {/* 05 — stator housing */}
          <g transform="translate(700 330)">
            <circle r="74" />
            <circle r="60" />
            <circle r="67" strokeDasharray="7 12" strokeWidth="12" opacity="0.45" />
            <rect x="-96" y="-96" width="192" height="192" rx="10" opacity="0.5" />
            <circle cx="-78" cy="-78" r="7" opacity="0.6" />
            <circle cx="78" cy="-78" r="7" opacity="0.6" />
            <circle cx="-78" cy="78" r="7" opacity="0.6" />
            <circle cx="78" cy="78" r="7" opacity="0.6" />
          </g>

          {/* 06 — end cap */}
          <g transform="translate(880 330)">
            <circle r="52" />
            <circle r="20" />
            <circle r="36" strokeDasharray="4 14" strokeWidth="14" opacity="0.45" />
          </g>

          {/* 07 — terminal housing */}
          <g transform="translate(1030 330)">
            <rect x="-46" y="-38" width="92" height="76" rx="8" />
            <path d="M-46 -14 H46 M-46 14 H46" opacity="0.4" />
            <rect x="46" y="-18" width="34" height="36" rx="4" opacity="0.7" />
          </g>
        </g>

        {/* ---------- gear train ---------- */}
        <g transform="translate(700 592)">
          <circle r="96" />
          <circle r="84" strokeDasharray="9 13" strokeWidth="22" opacity="0.4" />
          <circle r="58" opacity="0.7" />
          <circle r="18" />
          <path d="M0 -58 L0 58 M-58 0 L58 0" opacity="0.3" />

          <g transform="translate(168 -62)">
            <circle r="62" />
            <circle r="53" strokeDasharray="7 10" strokeWidth="16" opacity="0.4" />
            <circle r="13" />
          </g>

          <g transform="translate(150 96)">
            <circle r="44" />
            <circle r="37" strokeDasharray="6 9" strokeWidth="12" opacity="0.4" />
            <circle r="10" />
          </g>
        </g>

        {/* ---------- belt drive ---------- */}
        <g transform="translate(1010 470)" opacity="0.75">
          <circle r="56" />
          <circle r="14" />
          <circle cx="0" cy="188" r="34" />
          <circle cx="0" cy="188" r="9" />
          <path d="M-56 0 L-34 188 M56 0 L34 188" />
        </g>

        {/* ---------- encoder disc ---------- */}
        <g transform="translate(470 700)" opacity="0.8">
          <circle r="58" />
          <circle r="47" strokeDasharray="4 8" strokeWidth="16" opacity="0.5" />
          <circle r="11" />
          <path d="M-84 0 H-58" />
          <path d="M58 0 H84" />
        </g>

        {/* ---------- control board fragment ---------- */}
        <g transform="translate(880 700)" opacity="0.7">
          <rect x="-120" y="-70" width="240" height="140" rx="6" />
          <rect x="-92" y="-44" width="70" height="46" rx="3" />
          <path d="M-92 -21 H-22" opacity="0.5" />
          <rect x="14" y="-44" width="44" height="30" rx="3" />
          <path d="M-120 24 H-58 L-40 42 H40 L58 24 H120" opacity="0.6" />
          <path d="M-92 42 V70 M-64 42 V70 M-36 42 V70" opacity="0.45" />
          <circle cx="86" cy="-30" r="9" />
          <circle cx="86" cy="4" r="9" />
        </g>

        {/* ---------- dimension lines ---------- */}
        <g opacity="0.5">
          <path d="M700 496 V430 M868 430 V468" />
          <path d="M700 442 H868" strokeDasharray="none" />
          <path d="M706 437 L700 442 L706 447" />
          <path d="M862 437 L868 442 L862 447" />

          <path d="M1090 470 H1150 M1090 658 H1150" />
          <path d="M1140 470 V658" />
          <path d="M1135 476 L1140 470 L1145 476" />
          <path d="M1135 652 L1140 658 L1145 652" />
        </g>

        {/* ---------- leader lines and callouts ---------- */}
        <g opacity="0.6">
          <path d="M196 214 L150 262" />
          <circle cx="190" cy="208" r="13" />
          <path d="M340 150 L300 196" />
          <circle cx="346" cy="144" r="13" />
          <path d="M506 96 L470 140" />
          <circle cx="512" cy="90" r="13" />
          <path d="M560 640 L510 690" />
          <circle cx="566" cy="634" r="13" />
          <path d="M796 520 L742 566" />
          <circle cx="802" cy="514" r="13" />
        </g>

        {/* ---------- title block ---------- */}
        <g transform="translate(944 748)" opacity="0.65">
          <rect x="0" y="0" width="248" height="44" />
          <path d="M0 15 H248 M0 30 H248 M96 0 V44 M186 0 V44" />
        </g>

        {/* ---------- corner registration marks ---------- */}
        <g opacity="0.45">
          <path d="M1176 24 H1152 M1176 24 V48" />
          <path d="M1176 776 H1152 M1176 776 V752" />
        </g>
        </g>
      </svg>
    </div>
  );
}
