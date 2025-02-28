<script lang="ts">
  import { onMount } from "svelte";
  import { type GetProgressResponse } from "../type";
  import NixieText from "./NixieText.svelte";
  import Icon from "@iconify/svelte";

  let approveProgress: number;
  let meter = "0.000000%";

  const ANIMATION_DURATION = 4000; // duration in milliseconds
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  onMount(async () => {
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
      const data: GetProgressResponse = await response.json();
      approveProgress = data.approveProgress / 100;
      localStorage.setItem("progressData", JSON.stringify(data));
      localStorage.setItem("progressTime", now.toString());
    }

    if (approveProgress === 1) {
      approveProgress = 0.999999;
    }

    animateMeter();
  });

  function getRandomDigit(): number {
    return Math.floor(Math.random() * 10);
  }

  function buildMeterDisplay(
    finalNumber: number,
    revealedDigits: number
  ): string {
    const finalStr = finalNumber.toFixed(6);
    let result = "0.";

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

  function animateMeter() {
    const totalDigits = 6; // number of decimal places
    const timePerDigit = ANIMATION_DURATION / totalDigits;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const revealedDigits = Math.floor(elapsedTime / timePerDigit);

      if (revealedDigits < totalDigits) {
        meter = buildMeterDisplay(approveProgress, revealedDigits);
      } else {
        meter = approveProgress.toFixed(6) + "%";
        clearInterval(interval);
      }
    }, 50); // Update random numbers every 50ms for smooth animation
  }
</script>

<div
  class="flex flex-col gap-4 h-dvh justify-center items-center text-center bg-stone-950 p-4"
>
  <div class="flex items-center text-4xl md:text-6xl lg:text-8xl text-slate-50">
    <NixieText text="Opening the Gate" withTyping />
  </div>
  <div class="text-4xl">
    <NixieText text={meter} />
  </div>
</div>

<div
  class="flex gap-1 text-3xl border justify-center items-center z-50 fixed bottom-5 py-2 px-4 left-1/2 transform -translate-x-1/2 rounded-4xl glow-all"
>
  <a href="https://discord.gg/vZurW6rzg3" target="_blank" class="icon-link">
    <Icon icon="ic:baseline-discord" />
  </a>
  <a
    href="https://www.facebook.com/learningtranslator"
    target="_blank"
    class="icon-link"
  >
    <Icon icon="ic:baseline-facebook" />
  </a>
  <a
    href="https://www.youtube.com/@operationbifrost"
    target="_blank"
    class="icon-link"
  >
    <Icon icon="mdi:youtube" />
  </a>
</div>

<style>
  .icon-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 50%;
    transition:
      transform 0.3s ease,
      background-color 0.3s ease,
      backdrop-filter 0.3s ease;
  }

  .icon-link:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
  }
</style>
