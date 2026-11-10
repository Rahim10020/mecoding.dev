interface MasonryElements {
  viewport: HTMLElement;
  track: HTMLElement;
  copies: HTMLElement[];
}

/** Index de la copie accessible, celle qui est alignée en haut au chargement. */
const ACTIVE = 1;

/** Vitesse de défilement ambiant, en pixels par seconde. */
const AUTO_SPEED = 48;
/** Vitesse réduite lorsque le curseur survole la colonne. */
const AUTO_HOVER_SPEED = 8;
/** Délai de reprise après une interaction manuelle, en millisecondes. */
const AUTO_RESUME_DELAY = 1400;

const read = (): MasonryElements | null => {
  const viewport = document.querySelector<HTMLElement>(
    "[data-masonry-viewport]",
  );
  if (!viewport) return null;

  const track = viewport.querySelector<HTMLElement>("[data-masonry-track]");
  const copies = Array.from(
    viewport.querySelectorAll<HTMLElement>("[data-masonry-copy]"),
  );

  if (!track || copies.length < 2) return null;

  return { viewport, track, copies };
};

/** Ramène une position dans [height, 2 * height). */
const wrap = (value: number, height: number) => {
  const offset = value - height;
  const wrapped = ((offset % height) + height) % height;

  return wrapped + height;
};

export function initWorkMasonry(): void {
  const masonry = read();
  if (!masonry) return;

  const { viewport, track, copies } = masonry;
  const desktop = window.matchMedia("(min-width: 810px)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Hauteur d'une copie, mesurée après mise en page. */
  let height = 0;
  /** Ordonnée du haut du viewport dans la piste transformée. */
  let position = 0;
  let lastWidth = 0;
  let measureFrame = 0;

  /** Défilement ambiant (desktop, hors reduced-motion). */
  let autoFrame = 0;
  let autoRunning = false;
  let autoTime = 0;
  /** Animation d'un déplacement clavier. */
  let tweenFrame = 0;
  /** Curseur sur la colonne : l'auto-scroll ralentit. */
  let hovered = false;
  /** Focus dans la région : l'auto-scroll est suspendu. */
  let hasFocus = false;
  /** Horodatage de la dernière interaction manuelle. */
  let lastInput = 0;

  const render = () => {
    track.style.transform = `translate3d(0, ${-position}px, 0)`;
  };

  const stopTween = () => {
    if (!tweenFrame) return;

    window.cancelAnimationFrame(tweenFrame);
    tweenFrame = 0;
  };

  /**
   * Aligne la piste sur une position donnée, sans transition. Le rebouclage
   * se fait sur une copie voisine : le rendu est identique, donc le saut est
   * invisible.
   */
  const place = (value: number) => {
    stopTween();
    if (!height) return;

    position = wrap(value, height);
    render();
  };

  /** Courbe expo-out, proche de `ease-kelo`. */
  const easeOut = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

  /**
   * Rejoint `target` en une courte animation. La position est rebouclée à
   * chaque frame : le passage d'une copie à l'autre est invisible, donc un
   * déplacement clavier peut traverser la boucle sans saut visible.
   */
  const glide = (target: number) => {
    stopTween();
    if (!height) return;

    if (reduced.matches) {
      position = wrap(target, height);
      render();
      return;
    }

    const from = position;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - start) / 450, 1);
      position = wrap(from + (target - from) * easeOut(t), height);
      render();

      tweenFrame = t < 1 ? window.requestAnimationFrame(step) : 0;
    };

    tweenFrame = window.requestAnimationFrame(step);
  };

  const measure = () => {
    stopTween();

    if (!desktop.matches) {
      height = 0;
      track.style.transform = "";
      return;
    }

    const next = copies[ACTIVE].getBoundingClientRect().height;
    if (!next) return;

    const width = viewport.clientWidth;
    // Au changement de largeur, les ratios et la répartition des colonnes
    // changent : on repart du haut de la copie accessible.
    if (width !== lastWidth) {
      position = next;
      lastWidth = width;
    }

    height = next;
    position = wrap(position, height);
    render();
  };

  const scheduleMeasure = () => {
    window.cancelAnimationFrame(measureFrame);
    measureFrame = window.requestAnimationFrame(measure);
  };

  /** Pas de défilement clavier : jamais plus d'une demi-copie. */
  const keyboardStep = () =>
    Math.max(80, Math.min(viewport.clientHeight * 0.75, height * 0.6));

  const onWheel = (event: WheelEvent) => {
    if (!desktop.matches || !height || event.ctrlKey) return;

    const factor =
      event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? window.innerHeight
          : 1;

    event.preventDefault();
    lastInput = performance.now();
    place(position + event.deltaY * factor);
  };

  window.addEventListener("wheel", onWheel, { passive: false });

  // Clavier ---------------------------------------------------------------
  viewport.addEventListener("keydown", (event) => {
    if (!desktop.matches || !height) return;

    lastInput = performance.now();
    const step = keyboardStep();

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "PageDown":
        event.preventDefault();
        glide(position + step);
        break;
      case "ArrowUp":
      case "ArrowLeft":
      case "PageUp":
        event.preventDefault();
        glide(position - step);
        break;
      case "Home":
        event.preventDefault();
        glide(height);
        break;
      case "End":
        event.preventDefault();
        glide(Math.max(height, 2 * height - viewport.clientHeight));
        break;
    }
  });

  // Glisser-déposer -------------------------------------------------------
  let pointer: number | null = null;
  let origin = 0;
  let startPosition = 0;
  let moved = false;

  viewport.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (!desktop.matches || !height || event.button !== 0) return;

    stopTween();
    pointer = event.pointerId;
    origin = event.clientY;
    startPosition = position;
    moved = false;
    lastInput = performance.now();
  });

  viewport.addEventListener("pointermove", (event) => {
    if (pointer !== event.pointerId) return;

    const delta = event.clientY - origin;
    if (!moved && Math.abs(delta) > 4) {
      // Capture seulement au-delà du seuil : un clic simple doit atteindre
      // le lien de la carte, pas le viewport.
      moved = true;
      viewport.setPointerCapture(event.pointerId);
    }
    if (!moved) return;

    place(startPosition - delta);
  });

  const release = (event: PointerEvent) => {
    if (pointer !== event.pointerId) return;

    pointer = null;
    lastInput = performance.now();
    place(position);
  };

  viewport.addEventListener("pointerup", release);
  viewport.addEventListener("pointercancel", release);
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);

  viewport.addEventListener(
    "click",
    (event) => {
      if (!moved) return;

      event.preventDefault();
      event.stopPropagation();
      moved = false;
    },
    { capture: true },
  );

  // Focus clavier ---------------------------------------------------------
  viewport.addEventListener("focusin", (event) => {
    hasFocus = true;
    lastInput = performance.now();

    if (!desktop.matches || !height) return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const card = target.closest("a");
    if (!card) return;

    const trackTop = track.getBoundingClientRect().top;
    const rect = card.getBoundingClientRect();
    const top = rect.top - trackTop;
    const bottom = top + rect.height;
    const visibleBottom = position + viewport.clientHeight;

    let next = position;
    if (top < position + 16) {
      next = top - 16;
    } else if (bottom > visibleBottom - 16) {
      next = bottom - viewport.clientHeight + 16;
    }

    if (next === position) return;

    // On garde la copie accessible dans le haut du viewport.
    place(Math.min(Math.max(next, height), 2 * height - 1));
  });

  viewport.addEventListener("focusout", (event) => {
    const next = event.relatedTarget;
    if (next instanceof Node && viewport.contains(next)) return;

    hasFocus = false;
    lastInput = performance.now();
  });

  // Défilement ambiant -----------------------------------------------------
  /**
   * La piste avance toute seule, ralentit sous le curseur, et se suspend dès
   * qu'une interaction manuelle commence (molette, drag, clavier, focus).
   */
  const tick = (now: number) => {
    if (!autoRunning) return;

    const delta = autoTime ? Math.min((now - autoTime) / 1000, 0.064) : 0;
    autoTime = now;

    const idle =
      pointer === null && !hasFocus && now - lastInput > AUTO_RESUME_DELAY;

    if (height && idle && delta > 0) {
      const speed = hovered ? AUTO_HOVER_SPEED : AUTO_SPEED;
      position = wrap(position + speed * delta, height);
      render();
    }

    autoFrame = window.requestAnimationFrame(tick);
  };

  const syncAuto = () => {
    const shouldRun = desktop.matches && !reduced.matches;

    if (shouldRun && !autoRunning) {
      autoRunning = true;
      autoTime = 0;
      lastInput = performance.now();
      autoFrame = window.requestAnimationFrame(tick);
    } else if (!shouldRun && autoRunning) {
      autoRunning = false;
      window.cancelAnimationFrame(autoFrame);
    }
  };

  viewport.addEventListener("pointerenter", () => {
    hovered = true;
  });

  viewport.addEventListener("pointerleave", () => {
    hovered = false;
  });

  reduced.addEventListener("change", syncAuto);

  // Mise en page ----------------------------------------------------------
  const observer = new ResizeObserver(scheduleMeasure);
  observer.observe(viewport);

  desktop.addEventListener("change", () => {
    lastWidth = 0;
    scheduleMeasure();
    syncAuto();
  });

  measure();
  syncAuto();
}
