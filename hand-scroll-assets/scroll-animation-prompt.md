# Scroll Hero Animation Prompt

Create a clean white hero section inspired by the reference video. The center of the page has large bold black text. On the left side, place `left-hand.png`, a cropped painterly arm and hand reaching inward. On the right side, place `right-hand.png`, a matching cropped painterly arm and hand reaching inward from the opposite side. Both hand images must be layered above the white background and should have transparent backgrounds.

As the user scrolls, the animation is controlled by scroll progress from `0` to `1`.

At scroll progress `0`, the text starts centered in the viewport at a strong but controlled size. The left hand begins mostly outside the left edge of the screen, angled toward the center. The right hand begins mostly outside the right edge of the screen, angled toward the center. The hands should feel suspended near the top half of the hero, with the fingertips far apart.

As the user continues scrolling, the center text grows larger smoothly. Use transform scaling instead of changing font size, so the text stays locked to the center and does not reflow. Animate the text from about `scale(1)` to `scale(1.6)` or `scale(1.8)`.

At the same time, move both hands toward each other. The left hand should translate from the left side toward the center. The right hand should translate from the right side toward the center. Their index fingers should approach each other slowly, stopping with a small gap between them rather than touching. The motion should feel cinematic, smooth, and scroll-synced.

Recommended movement:

- `left-hand.png`: start around `x: -18vw, y: -4vh`, finish around `x: 2vw, y: 1vh`.
- `right-hand.png`: start around `x: 18vw, y: -4vh`, finish around `x: -2vw, y: 1vh`.
- Text: start at `scale(1)`, finish around `scale(1.65)`.
- Hands: optionally scale from `1` to `1.05` and rotate slightly toward each other, no more than `3deg`.

Use a sticky scroll setup: make the hero wrapper around `200vh` tall, with a `100vh` sticky stage inside it. Pin the text and hands inside the sticky stage, then interpolate their transforms based on scroll progress. The final frame should show the enlarged text in the center while the two painterly hands nearly meet above or across the headline, creating a dramatic editorial effect.

Keep the background plain white, keep the text black, and avoid extra decorations. The visual focus should be the growing headline and the two hands moving toward each other.
