<script lang="ts">
  import { cn } from '$lib/utils';
  export let href: string;

  let className: string | undefined = undefined;
  export { className as class };
</script>

<a
  class={cn(
    'flex flex-col items-center gap-2 rounded-2xl pb-4 pt-4 shadow transition-all',
    className
  )}
  {href}
>
  <slot name="icon" />
  <h2 class="text-lg">
    <slot name="title" />
  </h2>
</a>
