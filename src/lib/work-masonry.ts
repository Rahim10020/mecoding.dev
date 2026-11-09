interface MasonryElements {
  viewport: HTMLElement;
  track: HTMLElement;
  copies: HTMLElement[];
}

/** Index de la copie accessible, celle qui est alignée en haut au chargement. */
const ACTIVE = 1;

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
  let frame = 0;

  const render = () => {
    track.style.transform = `translate3d(0, ${-position}px, 0)`;
  };

  const instant = () => track.classList.add("no-motion");
  const animated = () => track.classList.remove("no-motion");

  /**
   * Aligne la piste sur une position donnée. Le rebouclage se fait sur une
   * copie voisine : le rendu est identique, donc le saut est invisible.
   */
  const place = (value: number, animate: boolean) => {
    if (!height) return;

    position = wrap(value, height);
    if (animate && !reduced.matches) {
      animated();
    } else {
      instant();
    }
    render();
  };

  const measure = () => {
    if (!desktop.matches) {
      height = 0;
      animated();
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
    instant();
    render();
  };

  const scheduleMeasure = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(measure);
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
    place(position + event.deltaY * factor, false);
  };

  window.addEventListener("wheel", onWheel, { passive: false });

  // Clavier ---------------------------------------------------------------
  viewport.addEventListener("keydown", (event) => {
    if (!desktop.matches || !height) return;

    const step = keyboardStep();

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "PageDown":
        event.preventDefault();
        place(position + step, true);
        break;
      case "ArrowUp":
      case "ArrowLeft":
      case "PageUp":
        event.preventDefault();
        place(position - step, true);
        break;
      case "Home":
        event.preventDefault();
        place(height, true);
        break;
      case "End":
        event.preventDefault();
        place(Math.max(height, 2 * height - viewport.clientHeight), true);
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

    pointer = event.pointerId;
    origin = event.clientY;
    startPosition = position;
    moved = false;

    instant();
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

    place(startPosition - delta, false);
  });

  const release = (event: PointerEvent) => {
    if (pointer !== event.pointerId) return;

    pointer = null;
    place(position, false);
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
    place(Math.min(Math.max(next, height), 2 * height - 1), false);
  });

  // Mise en page ----------------------------------------------------------
  const observer = new ResizeObserver(scheduleMeasure);
  observer.observe(viewport);

  desktop.addEventListener("change", () => {
    lastWidth = 0;
    scheduleMeasure();
  });

  measure();
}
