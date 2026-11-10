/**
 * Lecture paresseuse des vidéos de projet.
 *
 * Le Markdown pose `preload="none"` et aucun `autoplay` : rien n'est
 * téléchargé tant que `play()` n'est pas appelé. On branche donc la lecture
 * quand la vidéo approche du viewport, et on la met en pause dès qu'elle en
 * sort pour ne pas décoder une vidéo invisible.
 */
export function initLazyVideo(): void {
  const videos = Array.from(
    document.querySelectorAll<HTMLVideoElement>(".media-video"),
  );
  if (!videos.length) return;

  const play = (video: HTMLVideoElement) => {
    const attempt = video.play();
    // iOS en mode économie d'énergie peut refuser : le poster reste affiché.
    if (attempt) void attempt.catch(() => {});
  };

  if (!("IntersectionObserver" in window)) {
    for (const video of videos) play(video);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;

        if (entry.isIntersecting) {
          play(video);
        } else {
          video.pause();
        }
      }
    },
    { rootMargin: "300px 0px" },
  );

  for (const video of videos) observer.observe(video);
}
