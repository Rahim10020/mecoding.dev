interface CarouselElements {
  root: HTMLElement;
  viewport: HTMLElement;
  track: HTMLElement;
  items: HTMLElement[];
  captions: HTMLElement[];
  live: HTMLElement | null;
  count: number;
  step: number;
}

/** Délai après le dernier mouvement avant l'alignement sur une tuile. */
const SNAP_DELAY = 140;

const read = (): CarouselElements | null => {
  const root = document.querySelector<HTMLElement>("[data-carousel]");
  if (!root) return null;

  const viewport = root.querySelector<HTMLElement>("[data-carousel-viewport]");
  const track = root.querySelector<HTMLElement>("[data-carousel-track]");
  const count = Number(root.dataset.count);
  const step = Number(root.dataset.step);

  if (!viewport || !track || !count || !step) return null;

  return {
    root,
    viewport,
    track,
    items: Array.from(
      root.querySelectorAll<HTMLElement>("[data-carousel-item]"),
    ),
    captions: Array.from(
      root.querySelectorAll<HTMLElement>("[data-carousel-caption]"),
    ),
    live: root.querySelector<HTMLElement>("[data-carousel-live]"),
    count,
    step,
  };
};

export function initProjectCarousel(): void {
  const carousel = read();
  if (!carousel) return;

  const { viewport, track, items, captions, live, count, step } = carousel;

  /** Index virtuel : la copie du milieu commence à `count`. */
  let virtual = count;
  let active = 0;
  let snapTimer: number | undefined;

  const offset = (drag = 0) => -(virtual - count) * step + drag;

  const apply = (drag = 0, animate = true) => {
    if (!animate) {
      track.classList.add("no-motion");
    }

    track.style.transform = `translate3d(0, ${offset(drag)}px, 0)`;

    if (!animate) {
      // Force le recalcul avant de rendre la transition.
      void track.offsetHeight;
      track.classList.remove("no-motion");
    }
  };

  const renderNearest = (position: number) => {
    const nearest = Math.round(position);
    // `render` s'appuie sur `virtual` pour désigner la tuile active : on le
    // garde aligné sur la position affichée pendant le défilement.
    virtual = count + nearest;
    render(((nearest % count) + count) % count);
  };

  const render = (index: number) => {
    active = index;

    items.forEach((item) => {
      const global = Number(item.dataset.carouselGlobal);
      item.classList.toggle("is-active", global === virtual);
      item.setAttribute("tabindex", global === count + index ? "0" : "-1");
    });

    captions.forEach((caption) => {
      const current = Number(caption.dataset.carouselCaptionIndex) === index;
      caption.classList.toggle("is-active", current);
      caption.setAttribute("aria-hidden", String(!current));
      caption
        .querySelectorAll<HTMLElement>("a")
        .forEach((link) => link.setAttribute("tabindex", current ? "0" : "-1"));
    });

    if (live) {
      live.textContent =
        captions.find(
          (caption) => Number(caption.dataset.carouselCaptionIndex) === index,
        )?.dataset.title ?? "";
    }
  };

  const normalize = () => {
    // Ramène l'index virtuel dans la copie du milieu ; le track est décalé
    // d'une copie entière, ce qui reste invisible puisque les copies sont
    // identiques.
    const wrapped = count + ((((virtual - count) % count) + count) % count);

    if (wrapped === virtual) return;

    virtual = wrapped;
    apply(0, false);
    wheelPosition = virtual - count;
    render(((virtual % count) + count) % count);
  };

  const go = (direction: number) => {
    if (!count || direction === 0) return;

    virtual += direction;
    wheelPosition = virtual - count;
    track.classList.remove("no-motion");
    apply();
    render(((virtual % count) + count) % count);
  };

  const goTo = (target: number) => {
    let delta = (((target - active + count) % count) + count) % count;
    if (delta > count / 2) delta -= count;
    if (delta === 0) return;

    const direction = Math.sign(delta);
    for (let index = 0; index < Math.abs(delta); index += 1) {
      go(direction);
    }
  };

  apply(0, false);
  render(active);

  // Molette et trackpad ------------------------------------------------
  // Sur desktop la molette pilote le carrousel quelle que soit la position du
  // curseur, en boucle : la position est ramenée dans une fenêtre d'une copie.
  const desktop = window.matchMedia("(min-width: 810px)");
  let wheelPosition = 0;

  const snapToNearest = () => {
    const target = Math.round(wheelPosition);

    virtual = count + target;
    wheelPosition = target;
    track.classList.remove("no-motion");
    render(((virtual % count) + count) % count);
    apply();
  };

  const scheduleSnap = () => {
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(snapToNearest, SNAP_DELAY);
  };

  // Ramène une position dans [-count/2, count/2) : se décaler d'une copie
  // entière est invisible et garantit qu'aucun trou n'apparaît aux bords.
  const wrapPosition = (position: number) => {
    const half = count / 2;

    return ((((position + half) % count) + count) % count) - half;
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (!desktop.matches) return;
      // Le zoom natif (ctrl + molette) n'est pas intercepté.
      if (event.ctrlKey) return;

      const factor =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;

      event.preventDefault();

      wheelPosition = wrapPosition(
        wheelPosition + (event.deltaY * factor) / step,
      );

      track.classList.add("no-motion");
      track.style.transform = `translate3d(0, ${-wheelPosition * step}px, 0)`;
      renderNearest(wheelPosition);
      scheduleSnap();
    },
    { passive: false },
  );

  // Clavier -------------------------------------------------------------
  viewport.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "PageDown":
        event.preventDefault();
        go(1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
      case "PageUp":
        event.preventDefault();
        go(-1);
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(count - 1);
        break;
    }
  });

  // Glisser-déposer -----------------------------------------------------
  let pointer: number | null = null;
  let origin = 0;
  let dragged = 0;
  let moved = false;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    pointer = event.pointerId;
    origin = event.clientY;
    dragged = 0;
    moved = false;

    viewport.setPointerCapture(event.pointerId);
    track.classList.add("is-dragging");
  });

  viewport.addEventListener("pointermove", (event) => {
    if (pointer !== event.pointerId) return;

    dragged = event.clientY - origin;
    if (Math.abs(dragged) > 4) moved = true;

    apply(dragged);
  });

  const release = (event: PointerEvent) => {
    if (pointer !== event.pointerId) return;

    pointer = null;
    track.classList.remove("is-dragging");

    wheelPosition = virtual - count - dragged / step;
    snapToNearest();

    dragged = 0;
  };

  viewport.addEventListener("pointerup", release);
  viewport.addEventListener("pointercancel", release);

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

  track.addEventListener("transitionend", (event) => {
    if (event.target !== track || event.propertyName !== "transform") return;
    normalize();
  });
}
