<script lang="ts">
  import { onMount } from "svelte";
  import { type GetProgressResponse } from "../type";
  import NixieText from "./NixieText.svelte";
  import Icon from "@iconify/svelte";

  let approveProgress: number;
  let meter = "0.000000%";
  let currentProgress = 0;
  const animationDuration = 2000; // duration in milliseconds

  onMount(async () => {
    const response = await fetch("/api/progress");
    const data: GetProgressResponse = await response.json();
    approveProgress = data.approveProgress / 100; // convert to divergence meter style (42.1234% => 0.421234%)

    if (approveProgress === 1) {
      approveProgress = 0.999999;
    }

    animateMeter();
  });

  function animateMeter() {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < animationDuration) {
        currentProgress = (approveProgress * elapsedTime) / animationDuration;
        meter = currentProgress.toFixed(6) + "%";
      } else {
        meter = approveProgress.toFixed(6) + "%";
        clearInterval(interval);
      }
    }, 10); // Adjust the interval time for smoother or faster animation
  }
</script>

<div
  class="flex flex-col gap-4 h-screen justify-center items-center text-center bg-stone-950"
>
  <div class="text-5xl md:text-6xl lg:text-8xl text-slate-50">
    <NixieText text="Opening the Gate" />
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
