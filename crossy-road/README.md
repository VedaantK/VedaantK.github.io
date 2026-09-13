# Road Racer

## What is it?

Road Racer is a 3D browser game inspired by Crossy Road, built entirely with Three.js and vanilla JavaScript — no game engine, no build step.
Unlike the original Crossy Road, movement here is physics-based and continuous (WASD / arrow keys, not tap-to-hop), so the car accelerates and decelerates smoothly instead of jumping one square at a time. The world also generates infinitely as you drive forward, with cars and trucks that get faster once your score passes 20.

> **Note:** The two sentences above describe what makes this game distinct. Edit them in your own words before submitting — the course spec asks for this section to not be AI-written.

---

## How to Play

**Controls**

| Key | Action |
|-----|--------|
| `W` / `↑` | Move forward |
| `S` / `↓` | Move backward |
| `A` / `←` | Move left |
| `D` / `→` | Move right |

**Scoring**

Your score equals how many units forward you have traveled from the start. The further you go, the higher your score. There is no time limit.

**Losing**

You lose if a car or truck hits your vehicle. A "Game Over" overlay appears showing your final score. Click **Restart** to play again from zero.

**Tips**
- Grass rows are safe — the car will gently snap to the center of a grass row when you let go of the keys.
- Road rows have cars (red), truck rows have larger orange vehicles. Trucks are slower but wider.
- After score 20, all traffic speeds up significantly.

---

## AI Usage

**Model used:** Claude (Anthropic) — Claude Sonnet via Claude Code CLI

**Strategy:** I described the gameplay I wanted (Crossy Road feel, 3D, infinite world, physics movement) and asked Claude to help implement it section by section: the Three.js scene setup first, then the row generator, then player physics, then collision detection. I reviewed and tested each piece before moving to the next. I tuned the speed constants, difficulty threshold, and row probability weights myself through playtesting.

**What AI helped with:**
- Three.js boilerplate (WebGLRenderer, PerspectiveCamera, scene setup)
- Infinite world generation with forward culling
- ACCEL/FRICTION physics model for smooth movement
- Grass snap behaviour (spring toward row center)
- Camera lerp and snap-on-restart fix
- Ensuring cars on the same row move at the same speed (no catch-up collisions)

**What I directed / changed myself:**
- The overall game concept and controls
- Tuning speed values, difficulty tier threshold, and row type weights through playtesting
- Deciding to use physics-based movement instead of grid hops
- Testing edge cases (camera pop on restart, single-grass blips between hazard clusters)

---

## Known Issues / Unfinished Work

- No mobile / touch controls — keyboard only
- No high score persistence (resets on page reload)
- Decorative trees are just cylinder stumps; no full tree meshes
- No sound effects or music
