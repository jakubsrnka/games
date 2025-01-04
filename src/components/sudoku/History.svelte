<script lang="ts">
  import { user } from '$lib/client/user';
  import * as Card from '$components/ui/card';
  import { supabase } from '$lib/shared/supabase';
  import Time from '$components/elements/Time.svelte';
  import { Check } from 'lucide-svelte';
  import MiniGrid from './MiniGrid.svelte';
  import Completed from './Completed.svelte';
  import { Badge } from '$components/ui/badge';
  import Skeleton from '$components/ui/skeleton/skeleton.svelte';
</script>

<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#if $user}
    {#await supabase
      .from('sudoku')
      .select()
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          return data;
        }
      })}
      <Skeleton />
    {:then data}
      {#if data && data.length > 0}
        {#each data as item}
          <div class:pointer-events-none={item.completed} class:cursor-default={item.completed}>
            <a href={`/sudoku?id=${item.id}`}>
              <Card.Root class="transition-all hover:border-gray-500">
                <Card.Content class="flex gap-4 p-2">
                  <div class="relative p-2">
                    <MiniGrid grid={item.sudoku} />
                    {#if item.completed}
                      <div
                        class="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                      >
                        <Check class="text-lime-500" size="48" strokeWidth="3" />
                      </div>
                    {/if}
                  </div>
                  <div class="flex w-full flex-col gap-2">
                    <div class="flex w-full items-center justify-between">
                      <div class="font-mono">
                        <Time time={item.time} />
                      </div>
                      <Badge>
                        {item.difficulty}
                      </Badge>
                    </div>
                    <div class="mb-0 mt-auto flex items-center justify-end gap-4">
                      {#if !item.completed}
                        <Completed
                          grid={item.sudoku}
                          userSolution={item.user_solution}
                          progressBar
                        />
                      {/if}
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
            </a>
          </div>
        {/each}
      {:else}
        <Card.Root>
          <Card.Content class="p-2">
            <p class="text-center">No history found.</p>
          </Card.Content>
        </Card.Root>
      {/if}
    {/await}
  {:else}
    <Card.Root class="mb-4">
      <Card.Content class="p-2">
        <p class="text-center">You are not logged in. Please login to access the history.</p>
      </Card.Content>
    </Card.Root>
  {/if}
</section>
