<script lang="ts">
  import { Drawer as DrawerPrimitive } from 'vaul-svelte';
  import DrawerOverlay from './drawer-overlay.svelte';
  import { cn } from '$lib/utils.js';
  import DisableAutofocus from '$components/elements/DisableAutofocus.svelte';

  type $$Props = DrawerPrimitive.ContentProps;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<DrawerPrimitive.Portal>
  <DrawerOverlay />
  <DrawerPrimitive.Content
    class={cn(
      'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
      className
    )}
    {...$$restProps}
  >
    <DisableAutofocus />
    <div class="mx-auto mt-3 h-1 w-[120px] rounded-full bg-neutral-400" />
    <slot />
  </DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
