/**
 * Lecture paresseuse des vidéos de projet.
 *
 * Le Markdown pose `preload="none"` et aucun `autoplay` : rien n'est
 * téléchargé tant que `play()` n'est pas appelé. On branche donc la lecture
 * quand la vidéo approche du viewport, et on la met en pause dès qu'elle en
 * sort pour ne pas décoder une vidéo invisible.
 *
 * La lecture attend aussi la fin du chargement de la page : le poster reste
 * affiché pendant que les ressources critiques se chargent, et la vidéo ne
 * leur dispute pas la bande passante.
 */

/** Marge autour du viewport, en pixels. */
const MARGIN = 300;
/** Délai maximal avant de lancer la lecture, une fois la page prête. */
const IDLE_TIMEOUT = 1200;

export function initLazyVideo(): void {
  const videos = Array.from(
    document.querySelectorAll<HTMLVideoElement>(".media-video"),
  );
  if (!videos.length) return;

  let pageReady = document.readyState === "complete";
  const pending = new Set<HTMLVideoElement>();

  const isNearViewport = (video: HTMLVideoElement): boolean => {
    const rect = video.getBoundingClientRect();
    return rect.bottom > -MARGIN && rect.top < window.innerHeight + MARGIN;
  };

  const play = (video: HTMLVideoElement): void => {
    // La vidéo a pu quitter l'écran entre l'observation et la lecture.
    if (!isNearViewport(video)) return;

    const attempt = video.play();
    // iOS en mode économie d'énergie peut refuser : le poster reste affiché.
    if (attempt) void attempt.catch(() => {});
  };

  const requestPlay = (video: HTMLVideoElement): void => {
    if (!pageReady) {
      pending.add(video);
      return;
    }

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => play(video), { timeout: IDLE_TIMEOUT });
    } else {
      play(video);
    }
  };

  if (!pageReady) {
    window.addEventListener(
      "load",
      () => {
        pageReady = true;
        for (const video of pending) play(video);
        pending.clear();
      },
      { once: true },
    );
  }

  if (!("IntersectionObserver" in window)) {
    for (const video of videos) requestPlay(video);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;

        if (entry.isIntersecting) {
          requestPlay(video);
        } else {
          video.pause();
        }
      }
    },
    { rootMargin: `${MARGIN}px 0px` },
  );

  for (const video of videos) observer.observe(video);
}
