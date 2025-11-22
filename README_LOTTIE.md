How to add a local hero Lottie

Drop a Lottie JSON file at: `lottie/hero.json` relative to the project root.

Recommended settings:
- Max size: keep the JSON < 500KB for fast load.
- Suggested container: `.lottie-hero` (already in `index.html`)
- Recommended render: svg (already used by the loader)

If no local JSON is present the page will fall back to a small public Lottie from LottieFiles. If that also fails, the Lottie container will be removed and the page will remain fully functional.