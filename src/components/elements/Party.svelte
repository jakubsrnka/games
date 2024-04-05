<script lang="ts">
  import { onMount } from 'svelte';

  export let size = 24;

  const paths: SVGPathElement[] = [];

  onMount(() => {
    const min = Math.min(...paths.map((path) => path.getTotalLength()));

    paths.forEach((path) => {
      path.style.strokeDasharray = `${path.getTotalLength()}`;
      path.style.strokeDashoffset = `${path.getTotalLength()}`;
      path.style.animationDuration = `${(path.getTotalLength() / min) * 250}ms`;
    });
  });
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M5.8 11.2998L2 21.9998L12.7 18.2098" stroke="#0891B2" />
  <path d="M4 3H4.01" stroke="#10B981" class="animate-appear" />
  <path d="M22 8H22.01" stroke="#F43F5E" class="animate-appear" />
  <path d="M15 2H15.01" stroke="#A855F7" class="animate-appear" />
  <path d="M22 20H22.01" stroke="#6366F1" class="animate-appear" />
  <path
    d="M11 13C12.93 14.93 13.83 17.17 13 18C12.17 18.83 9.93002 17.93 8.00002 16C6.07002 14.07 5.17002 11.83 6.00002 11C6.83002 10.17 9.07002 11.07 11 13Z"
    stroke="#06B6D4"
  />
  <path
    d="M9.00002 7V6.23C8.99836 5.88503 9.12061 5.55093 9.34451 5.28848C9.56841 5.02604 9.87909 4.8527 10.22 4.8C10.4361 4.76233 10.641 4.67678 10.8197 4.54964C10.9984 4.42249 11.1464 4.25697 11.2528 4.0652C11.3593 3.87342 11.4215 3.66026 11.4348 3.44134C11.4482 3.22242 11.4124 3.00329 11.33 2.8L11 2"
    stroke="#F97316"
    bind:this={paths[2]}
    class="animate-dash"
  />
  <path
    d="M14 10L14.21 8.94C14.2902 8.52721 14.5139 8.15615 14.8416 7.89257C15.1692 7.62899 15.5796 7.48992 16 7.5H16.38C16.5835 7.49581 16.7839 7.44911 16.9683 7.36289C17.1528 7.27666 17.3171 7.15283 17.4508 6.99933C17.5845 6.84584 17.6847 6.66607 17.7448 6.47159C17.805 6.2771 17.8237 6.07218 17.8 5.87C17.7199 5.21687 17.8683 4.55616 18.22 4C18.5769 3.42972 19.1215 3.0018 19.76 2.79L22 2"
    stroke="#84CC16"
    bind:this={paths[0]}
    class="animate-dash"
  />
  <path
    d="M17 14.9976H17.77C18.1144 14.9972 18.4474 14.8742 18.7095 14.6507C18.9715 14.4271 19.1454 14.1176 19.2 13.7776C19.2377 13.5615 19.3232 13.3566 19.4504 13.1779C19.5775 12.9992 19.743 12.8512 19.9348 12.7447C20.1266 12.6383 20.3397 12.5761 20.5587 12.5628C20.7776 12.5494 20.9967 12.5852 21.2 12.6676L22 12.9976"
    stroke="#FACC15"
    bind:this={paths[1]}
    class="animate-dash"
  />
</svg>

<style>
  svg .animate-dash {
    animation: dash linear forwards;
  }

  svg .animate-appear {
    animation: appear 200ms linear forwards;
    animation-delay: 200ms;
    opacity: 0;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes appear {
    to {
      opacity: 1;
    }
  }
</style>
