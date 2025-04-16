<script lang="ts">
  import { onMount } from "svelte";
  import { type GetProgressResponse } from "../type";

  import NixieText from "./NixieText.svelte";
  import IconLink from "./IconLink.svelte";

  let approveProgress: number;
  let meter = $state("0.000000%");
  let animationInterval: number;
  let periodicInterval: number;
  let randomPhrase = $state("");

  const ANIMATION_DURATION = 4000; // duration in milliseconds
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  const REPLAY_INTERVAL = 10 * 60 * 1000; // 10 minutes

  const phrases = [
    "Opening the Gate",
    "Hacking to the Gate",
    "Calculating World Lines",
    "Synchronizing Timeline",
    "Gathering Divergence Data",
    "Processing Future Data",
  ];

  function getRandomPhrase() {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  async function fetchData() {
    const cachedData = localStorage.getItem("progressData");
    const cachedTime = localStorage.getItem("progressTime");
    const now = Date.now();

    if (
      cachedData &&
      cachedTime &&
      now - parseInt(cachedTime) < CACHE_DURATION
    ) {
      const data: GetProgressResponse = JSON.parse(cachedData);
      approveProgress = data.approveProgress / 100;
    } else {
      const response = await fetch("/api/progress");

      if (!response.ok) {
        console.error("Failed to fetch data");
        approveProgress = 0; // Set to 0 on failure to avoid infinite loop
        return;
      }

      const data: GetProgressResponse = await response.json();
      approveProgress = data.approveProgress / 100;
      localStorage.setItem("progressData", JSON.stringify(data));
      localStorage.setItem("progressTime", now.toString());
    }

    if (approveProgress === 1) {
      approveProgress = 1.048596; // Steins;Gate World Line
    }
  }

  async function startAnimation() {
    // Fetch new data before starting animation
    await fetchData();
    randomPhrase =
      approveProgress === 1.048596 ? "Reached Steins;Gate" : getRandomPhrase();

    // Clear any existing animation
    if (animationInterval) {
      clearInterval(animationInterval);
    }

    const totalDigits = 6;
    const timePerDigit = ANIMATION_DURATION / totalDigits;
    const startTime = Date.now();

    animationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const revealedDigits = Math.floor(elapsedTime / timePerDigit);

      if (revealedDigits < totalDigits) {
        meter = buildMeterDisplay(approveProgress, revealedDigits);
      } else {
        meter = approveProgress.toFixed(6) + "%";
        clearInterval(animationInterval);
      }
    }, 50);
  }

  onMount(() => {
    startAnimation();
    // Start periodic animation
    periodicInterval = setInterval(() => {
      startAnimation();
    }, REPLAY_INTERVAL);

    return () => {
      clearInterval(animationInterval);
      clearInterval(periodicInterval);
    };
  });

  function getRandomDigit(): number {
    return Math.floor(Math.random() * 10);
  }

  function buildMeterDisplay(
    finalNumber: number,
    revealedDigits: number
  ): string {
    const finalStr = finalNumber.toFixed(6);
    let result = finalNumber > 1 ? "1." : "0.";

    // Start from first decimal digit (position 2 in string)
    for (let i = 2; i < 8; i++) {
      // Shifted condition to treat first digit as not revealed initially
      if (i - 2 < revealedDigits) {
        result += finalStr[i];
      } else {
        result += getRandomDigit();
      }
    }

    return result + "%";
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="flex flex-col gap-4 h-dvh justify-center items-center text-center bg-stone-950 p-4"
  onclick={startAnimation}
  role="button"
  tabindex="0"
>
  <div class="flex items-center text-5xl md:text-6xl lg:text-8xl text-slate-50">
    <NixieText text={meter} />
  </div>
  <div class={`text-4xl ${randomPhrase ? "" : "invisible"}`}>
    <NixieText text={randomPhrase} withTyping />
  </div>
</div>

<footer
  class="flex gap-1 text-3xl border justify-center items-center z-50 fixed bottom-5 py-2 px-4 left-1/2 transform -translate-x-1/2 rounded-4xl glow-all"
>
  <IconLink icon="ic:baseline-discord" link="https://discord.gg/8WHxqbCjGD" />
  <IconLink
    icon="ic:baseline-facebook"
    link="https://www.facebook.com/learningtranslator"
  />
  <IconLink
    icon="mdi:youtube"
    link="https://www.youtube.com/@operationbifrost"
  />
</footer>
