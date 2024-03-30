<script lang="ts">
  import Game from '$components/elements/Game.svelte';
  import { Grid3x3, User2 } from 'lucide-svelte';
</script>

<div class="grid grid-cols-[40px_1fr_40px] items-center border-b p-3">
  <h1 class="col-start-2 text-center text-2xl font-light">Jakhub Games</h1>
  <div class="grid h-8 w-8 place-items-center">
    <User2 absoluteStrokeWidth />
  </div>
</div>
<main class="p-6">
  <div class="m-auto grid w-full max-w-96 grid-cols-2 gap-4">
    <Game href="/sudoku" class="bg-violet-300">
      <h2 slot="title">Sudoku</h2>
      <Grid3x3 slot="icon" size={32} absoluteStrokeWidth />
    </Game>
  </div>
</main>
