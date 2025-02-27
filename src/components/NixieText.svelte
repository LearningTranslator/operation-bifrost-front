<script lang="ts">
  export let text: string;
</script>

<h1 class="font-[bonx-frame] absolute opacity-40 frame">{text}</h1>
<h1 class="font-[bonx-sihouette] absolute opacity-40 sihouette">{text}</h1>
<h1 class="font-[bonx] title">{text}</h1>

<style>
  @font-face {
    font-family: "bonx";
    src: url("/fonts/BONX-Medium.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "bonx-frame";
    src: url("/fonts/BONX-Frame.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "bonx-sihouette";
    src: url("/fonts/BONX-Silhouette.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  .frame {
    color: rgba(255, 0, 0, 0.4);
  }

  .sihouette {
    color: rgba(220, 42, 27, 0.4);
  }

  .title {
    color: rgb(251, 192, 0);
    animation: glow 3s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from {
      text-shadow:
        0 0 20px rgb(251, 192, 0),
        0 0 50px rgb(251, 192, 0),
        0 0 5px rgb(255, 212, 71);
    }
    to {
      text-shadow:
        0 0 30px rgb(255, 219, 101),
        0 0 60px rgb(255, 219, 101),
        0 0 15px rgb(255, 203, 30);
    }
  }
</style>
