/**
 * Tiny signal so the page can hold back expensive work until the intro loader
 * is out of the way. The WebGL background compiles and runs a full-screen
 * shader at 60fps; starting that while the loader animates is what made the
 * intro stutter on Safari.
 *
 * Module-level flag plus an event, so a listener that subscribes late (or after
 * the intro already finished) still gets the answer.
 */

const EVENT = "intro:done";

let done = false;

export function isIntroDone() {
  return done;
}

export function markIntroDone() {
  if (done) return;
  done = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onIntroDone(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
