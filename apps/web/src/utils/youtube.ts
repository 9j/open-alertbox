export function getVideoId(url) {
  const pattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

export function getStartSeconds(url) {
  const pattern = /t=(\d+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}
