<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';
  import { buttonVariants, type Props, type Events } from './index.js';
  import { Loader, Loader2 } from 'lucide-svelte';

  type $$Props = Props;
  type $$Events = Events;

  let className: $$Props['class'] = undefined;
  export let variant: $$Props['variant'] = 'outline';
  export let size: $$Props['size'] = 'default';
  export let builders: $$Props['builders'] = [];
  export { className as class };
  export let loading: $$Props['loading'] = false;
  export let disabled: $$Props['disabled'] = loading;
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, className }), 'relative')}
  type="button"
  {...$$restProps}
  on:click
  on:keydown
  {disabled}
>
  <slot />
  {#if loading}
    <div class="animate-spin-slow absolute right-2 grid h-6 w-6 place-content-center">
      <Loader />
    </div>
  {/if}
</ButtonPrimitive.Root>
