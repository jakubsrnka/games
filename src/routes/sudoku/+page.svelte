<script lang="ts">
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
</script>

<Header />

<div class="m-4 ml-auto mr-auto flex w-fit flex-col items-center gap-4">
  {#key $sudokuSettings.difficulty}
    <Grid let:setDigit let:removeDigit let:setCandidate let:removeCandidates>
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
              <Setter bind:value f={setCandidate} x={removeCandidates} candidates />
            </div>
            <div class=" m-auto mt-2 flex w-fit cursor-pointer items-center gap-2">
              <Switch bind:checked={$sudokuSettings.autoCandidates} id="auto" />
              <Label for="auto">Auto candidates</Label>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Grid>
  {/key}
</div>
