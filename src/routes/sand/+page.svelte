<script lang="ts">
  import { onMount } from 'svelte';

  const width = 100;
  const height = 150;
  const cellSize = 5; // pixels per grain

  type Grain = { color: string; base: string };
  type Shape = {
    cells: { x: number; y: number }[];
    color: string;
    w: number;
    h: number;
    element?: HTMLCanvasElement;
  };

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let grid: (Grain | null)[][] = Array.from({ length: height }, () => Array(width).fill(null));

  let score = 0;

  function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ec4899', '#a855f7'];

  function randomColor() {
    return COLORS[rand(0, COLORS.length - 1)];
  }

  function varyColor(hex: string) {
    const amt = rand(-15, 15);
    const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amt));
    const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amt));
    const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amt));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
      .toString(16)
      .padStart(2, '0')}`;
  }

  function generateShape(): Shape {
    let w: number, h: number;
    do {
      w = rand(5, 30);
      h = rand(5, 30);
    } while (w * h < 100 || w * h > 900);
    const cells = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        cells.push({ x, y });
      }
    }
    return { cells, color: randomColor(), w, h };
  }

  let shapes: (Shape | null)[] = [generateShape(), generateShape(), generateShape()];
  let dragIndex: number | null = null;

  function handleDragStart(event: DragEvent, index: number) {
    dragIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    if (dragIndex === null) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    const shape = shapes[dragIndex];
    if (shape) spawnShape(shape, x, y);
    shapes[dragIndex] = null;
    dragIndex = null;
    if (shapes.every((s) => s === null)) {
      shapes = [generateShape(), generateShape(), generateShape()];
    }
  }

  function spawnShape(shape: Shape, px: number, py: number) {
    for (const cell of shape.cells) {
      const x = px + cell.x;
      const y = py + cell.y;
      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[y][x] = { color: varyColor(shape.color), base: shape.color };
      }
    }
  }

  function update() {
    let moved = false;
    for (let y = height - 2; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const g = grid[y][x];
        if (!g) continue;
        if (!grid[y + 1][x]) {
          grid[y + 1][x] = g;
          grid[y][x] = null;
          moved = true;
        } else {
          const dir = Math.random() < 0.5 ? -1 : 1;
          if (dir === -1) {
            if (x > 0 && !grid[y + 1][x - 1]) {
              grid[y + 1][x - 1] = g;
              grid[y][x] = null;
              moved = true;
            } else if (x < width - 1 && !grid[y + 1][x + 1]) {
              grid[y + 1][x + 1] = g;
              grid[y][x] = null;
              moved = true;
            }
          } else {
            if (x < width - 1 && !grid[y + 1][x + 1]) {
              grid[y + 1][x + 1] = g;
              grid[y][x] = null;
              moved = true;
            } else if (x > 0 && !grid[y + 1][x - 1]) {
              grid[y + 1][x - 1] = g;
              grid[y][x] = null;
              moved = true;
            }
          }
        }
      }
    }
    if (!moved) {
      checkClusters();
    }
  }

  function checkClusters() {
    const visited = Array.from({ length: height }, () => Array(width).fill(false));
    const toRemove: [number, number][] = [];
    for (let y = 0; y < height; y++) {
      const cell = grid[y][0];
      if (cell && !visited[y][0]) {
        const queue: [number, number][] = [[0, y]];
        const component: [number, number][] = [];
        let touchesRight = false;
        while (queue.length) {
          const [cx, cy] = queue.pop()!;
          if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
          if (visited[cy][cx]) continue;
          const grain = grid[cy][cx];
          if (!grain || grain.base !== cell.base) continue;
          visited[cy][cx] = true;
          component.push([cx, cy]);
          if (cx === width - 1) touchesRight = true;
          queue.push([cx + 1, cy]);
          queue.push([cx - 1, cy]);
          queue.push([cx, cy + 1]);
          queue.push([cx, cy - 1]);
        }
        if (touchesRight) {
          for (const pos of component) toRemove.push(pos);
        }
      }
    }
    if (toRemove.length) {
      for (const [x, y] of toRemove) grid[y][x] = null;
      score += toRemove.length;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width * cellSize, height * cellSize);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const g = grid[y][x];
        const px = x * cellSize;
        const py = y * cellSize;
        if (g) {
          ctx.fillStyle = g.color;
          ctx.fillRect(px, py, cellSize, cellSize);
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.strokeRect(px, py, cellSize, cellSize);
      }
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  onMount(() => {
    ctx = canvas.getContext('2d')!;
    loop();
  });

  $: {
    for (const shape of shapes) {
      if (shape && shape.element) drawShapePreview(shape);
    }
  }

  function drawShapePreview(shape: Shape) {
    const size = 10;
    const ctx = shape.element!.getContext('2d')!;
    shape.element!.width = shape.w * size;
    shape.element!.height = shape.h * size;
    ctx.clearRect(0, 0, shape.element!.width, shape.element!.height);
    for (const cell of shape.cells) {
      ctx.fillStyle = shape.color;
      ctx.fillRect(cell.x * size, cell.y * size, size, size);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.strokeRect(cell.x * size, cell.y * size, size, size);
    }
  }
</script>

<svelte:head>
  <title>Sand Game | Jakhub Games</title>
</svelte:head>

<div class="m-4 flex flex-col items-center gap-4">
  <div class="text-lg font-semibold">Score: {score}</div>
  <canvas
    bind:this={canvas}
    width={width * cellSize}
    height={height * cellSize}
    class="border"
    on:dragover|preventDefault
    on:drop={handleDrop}
  />
  <div class="flex gap-4">
    {#each shapes as shape, i}
      {#if shape}
        <canvas
          bind:this={shape.element}
          draggable="true"
          class="cursor-move border"
          on:dragstart={(e) => handleDragStart(e, i)}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  canvas {
    image-rendering: pixelated;
  }
</style>
