<script lang="ts">
  import { page } from '$app/stores';
  import Grid from '$components/sudoku/Grid.svelte';
  import Header from '$components/sudoku/Header.svelte';
  import Setter from '$components/sudoku/Setter.svelte';
  import Label from '$components/ui/label/label.svelte';
  import Switch from '$components/ui/switch/switch.svelte';
  import { Tabs, TabsList, TabsTrigger } from '$components/ui/tabs';
  import TabsContent from '$components/ui/tabs/tabs-content.svelte';
  import { sudokuSettings } from '$lib/sudoku/stores';
  import { type Digit } from 'sudoku-master';

  let value: Digit | null;

  let id: string | null = $page.url.searchParams.get('id');

  let newGame: () => Promise<void>;
</script>

<svelte:head>
  <title>Sudoku | Jakhub Games</title>
</svelte:head>

<Header {newGame} />

<div class="m-4 ml-auto mr-auto flex w-fit flex-col items-center gap-4">
  <Grid let:setDigit let:removeDigit let:setCandidate let:removeAllCandidates bind:newGame bind:id>
    <Tabs class="w-full">
      <div class="m-auto w-fit">
        <TabsList>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>
      </div>
      <div class="w-full">
        <TabsContent value="values">
          <div class="grid w-full grid-cols-5 gap-2">
            <Setter bind:value f={setDigit} x={removeDigit} />
          </div>
        </TabsContent>
        <TabsContent value="candidates">
          <div class="grid w-full grid-cols-5 gap-2">
            <Setter bind:value f={setCandidate} x={removeAllCandidates} candidates />
          </div>
          <div class=" m-auto mt-2 flex w-fit cursor-pointer items-center gap-2">
            <Switch bind:checked={$sudokuSettings.autoCandidates} id="auto" />
            <Label for="auto">Auto candidates</Label>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  </Grid>
</div>
