<script lang="ts">
  import Game from '$components/elements/Game.svelte';
  import { Grid3x3 } from 'lucide-svelte';
</script>

<main class="p-6">
  <h1 class="text-center text-xl">Welcome to Jakhub Games!</h1>

  <div class="m-auto mt-4 grid w-full max-w-96 grid-cols-2 gap-4">
    <Game href="/sudoku" class="bg-violet-300">
      <h2 slot="title">Sudoku</h2>
      <Grid3x3 slot="icon" size={32} absoluteStrokeWidth />
    </Game>
  </div>
</main>
