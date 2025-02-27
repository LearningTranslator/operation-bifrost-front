<script lang="ts">
  import { onMount } from "svelte";
  import { type GetProgressResponse } from "../type";
  import NixieText from "./NixieText.svelte";

  let approveProgress: number;
  let meter = "0.000000%";
  let currentProgress = 0;
  const animationDuration = 2000; // duration in milliseconds

  onMount(async () => {
    const response = await fetch("/api/progress");
    const data: GetProgressResponse = await response.json();
    approveProgress = data.approveProgress / 100; // convert to divergence meter style (42.1234% => 0.421234%)
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
