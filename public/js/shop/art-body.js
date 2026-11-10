/* Astrolab — the base figure, drawn anatomically.
   Landmarks in the avatar's own 112 x 212 space (measured, not guessed):
     head        centre (56,54)  rx 24  ry 26   → chin at y 84
     ears        (30,58) and (82,58)  rx 4.6 ry 6
     neck        x 48..64,  y 74..94
     shoulders   y 96,  x 36..76      (deltoid centres 39 / 73)
     waist       y 136, x 40..72
     hips        y 154, x 38..74
     elbows      (34,132) / (78,132)
     wrists      (37,160) / (75,160)
     hands       (37,168) / (75,168)
     knees       y 176, ankles y 196, soles y 206
   Everything is built from soft gradients plus an occlusion pass, so the figure
   reads as a lit 3D body rather than flat fills.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};
  let n = 0;

  A.body = function (skin) {
    const sk = skin || '#f1c27d';
    const id = 'bd' + (++n);
    const D = (v) => v;

    /* one limb: a tapered capsule, its lit side and its shaded side */
    const limb = (d, w, hi, sh) => [
      `<path d="${d}" stroke="url(#${id}k)" stroke-width="${w}" stroke-linecap="round" fill="none"/>`,
      `<path d="${d}" stroke="#fff" stroke-opacity=".22" stroke-width="${w * 0.34}"
        stroke-linecap="round" fill="none" transform="translate(${-hi} ${-hi})"/>`,
      `<path d="${d}" stroke="#3a1f10" stroke-opacity=".16" stroke-width="${w * 0.34}"
        stroke-linecap="round" fill="none" transform="translate(${sh} ${sh})"/>`,
    ].join('');

    return `<defs>
      <radialGradient id="${id}k" cx=".36" cy=".3" r=".82">
        <stop offset="0" stop-color="#000" stop-opacity=".30"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}s" x1=".2" y1="0" x2=".9" y2="1">
        <stop offset="0" stop-color="#fff4e2" stop-opacity=".85"/>
        <stop offset=".35" stop-color="${sk}"/>
        <stop offset="1" stop-color="${sk}"/>
      </linearGradient>
      <linearGradient id="${id}sh" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#5a2f14" stop-opacity="0"/>
        <stop offset=".62" stop-color="#5a2f14" stop-opacity=".06"/>
        <stop offset="1" stop-color="#5a2f14" stop-opacity=".22"/>
      </linearGradient>
    </defs>

    <!-- —— contact shadows: a wide soft one and a tight dark one —— -->
    <ellipse cx="56" cy="208" rx="38" ry="7" fill="url(#${id}k)" opacity=".18"/>
    <ellipse cx="56" cy="206" rx="21" ry="3.2" fill="#000" opacity=".30"/>

    <!-- —— legs: thigh → knee → calf → ankle, each with lit and shaded sides —— -->
    ${limb('M50 150C48 160 47 168 47 176C47 184 46 190 46 195', 17, 2.5, 3)}
    ${limb('M62 150C64 160 65 168 65 176C65 184 66 190 66 195', 17, 2.5, 3)}
    <path d="M56 158V194" stroke="#3a1f10" stroke-opacity=".18" stroke-width="7"
      stroke-linecap="round"/>
    <ellipse cx="47" cy="176" rx="6" ry="3.4" fill="#fff" opacity=".10"/>
    <ellipse cx="65" cy="176" rx="6" ry="3.4" fill="#fff" opacity=".10"/>

    <!-- —— torso beneath the clothes: chest, waist, hips —— -->
    <path d="M38 96q18-6 36 0l3 34-4 26H40l-4-26z" fill="url(#${id}s)"/>
    <path d="M38 96q18-6 36 0l3 34-4 26H40l-4-26z" fill="url(#${id}sh)"/>
    <path d="M46 100q10 4 20 0" stroke="#3a1f10" stroke-opacity=".12" stroke-width="2.4"
      fill="none" stroke-linecap="round"/>
    <path d="M56 104v48" stroke="#3a1f10" stroke-opacity=".08" stroke-width="4"/>

    <!-- —— neck: column, jaw shadow, collarbones —— -->
    <path d="M49 72h14v22H49z" fill="url(#${id}s)"/>
    <path d="M49 72h14v22H49z" fill="url(#${id}sh)"/>
    <ellipse cx="56" cy="78" rx="8.6" ry="4.4" fill="#3a1f10" opacity=".22"/>
    <path d="M49 88q7 4 14 0" stroke="#3a1f10" stroke-opacity=".14" stroke-width="2"
      fill="none" stroke-linecap="round"/>
    <path d="M44 94q6-3 10-1M68 94q-6-3-10-1" stroke="#3a1f10" stroke-opacity=".16"
      stroke-width="1.8" fill="none" stroke-linecap="round"/>

    <!-- —— arms: deltoid, bicep, forearm taper, wrist, hand —— -->
    <ellipse cx="38.5" cy="104" rx="7.4" ry="8.4" fill="url(#${id}s)"/>
    <ellipse cx="73.5" cy="104" rx="7.4" ry="8.4" fill="url(#${id}s)"/>
    ${limb('M37 108C33 118 32 126 33 134', 12, 2, 2.6)}
    ${limb('M75 108C79 118 80 126 79 134', 12, 2, 2.6)}
    ${limb('M33 136C35 144 36 152 37 158', 10.5, 2, 2.4)}
    ${limb('M79 136C77 144 76 152 75 158', 10.5, 2, 2.4)}
    <!-- elbow creases -->
    <path d="M30 133q3 3 7 2M82 133q-3 3-7 2" stroke="#3a1f10" stroke-opacity=".18"
      stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <!-- hands: palm, then four fingers and a thumb -->
    <g class="av-hand">
      <path d="M34 158q-2 6-1 9 2 4 7 4t6-4q1-3 0-9z" fill="url(#${id}s)"/>
      <path d="M36 168v4M39.5 168v5M43 168v4" stroke="#3a1f10" stroke-opacity=".22"
        stroke-width="1.3" stroke-linecap="round"/>
      <path d="M34 159q-3 2-3 5" stroke="url(#${id}s)" stroke-width="3.4"
        stroke-linecap="round" fill="none"/>
    </g>
    <g class="av-hand">
      <path d="M78 158q2 6 1 9-2 4-7 4t-6-4q-1-3 0-9z" fill="url(#${id}s)"/>
      <path d="M76 168v4M72.5 168v5M69 168v4" stroke="#3a1f10" stroke-opacity=".22"
        stroke-width="1.3" stroke-linecap="round"/>
      <path d="M78 159q3 2 3 5" stroke="url(#${id}s)" stroke-width="3.4"
        stroke-linecap="round" fill="none"/>
    </g>

    <!-- —— head: skull + jaw as a path, so it has a chin and cheekbones —— -->
    <g class="av-head">
      <!-- ears, with an inner fold and a shadow that grounds them -->
      <path d="M32 54q-4 1-4 5t4 5q3 0 3-3V57q0-3-3-3z" fill="url(#${id}s)"/>
      <path d="M31 57q-2 1-1 3" stroke="#3a1f10" stroke-opacity=".2" stroke-width="1.4"
        fill="none" stroke-linecap="round"/>
      <path d="M80 54q4 1 4 5t-4 5q-3 0-3-3V57q0-3 3-3z" fill="url(#${id}s)"/>
      <path d="M81 57q2 1 1 3" stroke="#3a1f10" stroke-opacity=".2" stroke-width="1.4"
        fill="none" stroke-linecap="round"/>
      <path d="M81 54q3 1 3 5" stroke="#3a1f10" stroke-opacity=".12" stroke-width="1.6"
        fill="none"/>

      <!-- the head itself: wider at the temples, tapering to the chin -->
      <path d="M56 28c13.6 0 24 10.2 24 24 0 7-2 12-5 16.5-3 4.4-8 7.5-13 9.5
               -2.4 1-4.2 1.4-6 1.4s-3.6-.4-6-1.4c-5-2-10-5.1-13-9.5C34 64 32 59 32 52
               32 38.2 42.4 28 56 28z" fill="url(#${id}s)"/>
      <!-- form shading: temple shadow, cheek light, jaw occlusion -->
      <path d="M56 28c13.6 0 24 10.2 24 24 0 7-2 12-5 16.5-3 4.4-8 7.5-13 9.5
               -2.4 1-4.2 1.4-6 1.4s-3.6-.4-6-1.4c-5-2-10-5.1-13-9.5C34 64 32 59 32 52
               32 38.2 42.4 28 56 28z" fill="url(#${id}sh)"/>
      <ellipse cx="45" cy="42" rx="14" ry="11" fill="#fff" opacity=".10"/>
      <path d="M74 60c-4 8-10 13-18 16" stroke="#3a1f10" stroke-opacity=".10"
        stroke-width="7" fill="none" stroke-linecap="round"/>
      <ellipse cx="43" cy="63" rx="5" ry="3.2" fill="#e08a6a" opacity=".16"/>
      <ellipse cx="69" cy="63" rx="5" ry="3.2" fill="#e08a6a" opacity=".16"/>
      <path d="M56 55v10" stroke="#3a1f10" stroke-opacity=".07" stroke-width="2"
        fill="none" stroke-linecap="round"/>
      <!-- nose: bridge shadow, tip, nostrils -->
      <path d="M53 62q3 3 3 6 0 2-2 2" stroke="#3a1f10" stroke-opacity=".18"
        stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <ellipse cx="56" cy="71" rx="3.4" ry="1.6" fill="#fff" opacity=".16"/>
      <circle cx="53" cy="71.6" r=".9" fill="#3a1f10" opacity=".35"/>
      <circle cx="59" cy="71.6" r=".9" fill="#3a1f10" opacity=".35"/>
      <!-- chin light + neck shadow edge -->
      <ellipse cx="56" cy="78" rx="6" ry="3" fill="#fff" opacity=".14"/>
    </g>`;
  };
})();
