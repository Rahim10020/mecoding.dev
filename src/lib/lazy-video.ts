/**
 * Lecture paresseuse des vidéos de projet.
 *
 * Le Markdown pose `preload="none"` et aucun `autoplay` : rien n'est
 * téléchargé tant que `play()` n'est pas appelé.
 *
 * Sur mobile et sur les connexions lentes (2G/3G, économiseur de données),
 * l'autoplay est désactivé : le poster reste affiché et un bouton play/pause
 * permet de lancer la démo à la demande. Ailleurs, la lecture démarre quand
 * la vidéo approche du viewport, après le chargement de la page pour ne pas
 * disputer la bande passante aux ressources critiques.
 */

/** Marge autour du viewport, en pixels. */
const MARGIN = 300;
/** Délai maximal avant de lancer la lecture, une fois la page prête. */
const IDLE_TIMEOUT = 1200;

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" fill="currentColor"/></svg>';
const PAUSE_ICON =
  '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>';

/** API Network Information, non standard et absente de Firefox/Safari. */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Formats réellement proposés dans le Markdown. Le VP9 est le format léger,
 * le H.264 sert de secours aux navigateurs qui ne décodent pas le WebM
 * (iOS avant 26.2 notamment).
 */
const SOURCE_TYPES = [
  'video/webm; codecs="vp9"',
  'video/mp4; codecs="avc1.640028"',
];

/** Faux quand aucun des formats proposés n'est lisible par le navigateur. */
function canPlayAny(video: HTMLVideoElement): boolean {
  return SOURCE_TYPES.some((type) => video.canPlayType(type) !== "");
}

/**
 * Vrai quand la vidéo ne doit pas démarrer toute seule : petit écran,
 * économiseur de données ou connexion 2G/3G.
 */
function isLiteMode(): boolean {
  if (window.matchMedia("(max-width: 809px)").matches) return true;

  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;

  if (!connection) return false;
  if (connection.saveData) return true;

  return ["slow-2g", "2g", "3g"].includes(connection.effectiveType ?? "");
}

export function initLazyVideo(): void {
  const videos = Array.from(
    document.querySelectorAll<HTMLVideoElement>(".media-video"),
  );
  if (!videos.length) return;

  const lite = isLiteMode();

  const isNearViewport = (video: HTMLVideoElement): boolean => {
    const rect = video.getBoundingClientRect();
    return rect.bottom > -MARGIN && rect.top < window.innerHeight + MARGIN;
  };

  const play = (video: HTMLVideoElement): Promise<void> | undefined => {
    // La vidéo a pu quitter l'écran entre l'observation et la lecture.
    if (!isNearViewport(video)) return;

    const attempt = video.play();
    // iOS en mode économie d'énergie peut refuser : le poster reste affiché.
    if (attempt) attempt.catch(() => {});
    return attempt;
  };

  /**
   * Ajoute un bouton play/pause sur le poster. Le parent direct (le `<p>` du
   * Markdown) devient le repère de positionnement et reprend la largeur d'un
   * média seul, que `:only-child` ne peut plus détecter à cause du bouton.
   */
  const addToggle = (video: HTMLVideoElement): void => {
    const parent = video.parentElement;
    if (!parent || parent.querySelector(".media-video-toggle")) return;
    // Pas de bouton si le navigateur ne sait décoder aucun des formats :
    // un contrôle qui ne fait rien est pire que pas de contrôle.
    if (!canPlayAny(video)) return;

    parent.classList.add("media-video-host");

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "media-video-toggle";
    toggle.setAttribute("aria-label", "Play video");
    toggle.innerHTML = PLAY_ICON;

    const sync = (): void => {
      const playing = !video.paused && !video.ended;
      toggle.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
      toggle.setAttribute("aria-label", playing ? "Pause video" : "Play video");
    };

    toggle.addEventListener("click", () => {
      if (video.paused || video.ended) {
        const attempt = play(video);
        // Décodage impossible malgré `canPlayType` : on retire le contrôle.
        attempt?.catch(() => {
          toggle.remove();
          parent.classList.remove("media-video-host");
        });
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    video.addEventListener("ended", sync);

    parent.append(toggle);
  };

  let requestPlay: (video: HTMLVideoElement) => void = () => {};

  if (lite) {
    for (const video of videos) addToggle(video);
  } else {
    let pageReady = document.readyState === "complete";
    const pending = new Set<HTMLVideoElement>();

    requestPlay = (video) => {
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
  }

  if (!("IntersectionObserver" in window)) {
    if (!lite) for (const video of videos) requestPlay(video);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;

        if (entry.isIntersecting) {
          if (!lite) requestPlay(video);
        } else {
          video.pause();
        }
      }
    },
    { rootMargin: `${MARGIN}px 0px` },
  );

  for (const video of videos) observer.observe(video);
}
