<script lang="ts">
import SectionCard from '$lib/components/SectionCard.svelte';
import type { PageData } from './$types';

export let data: PageData;
</script>

<h1>Hi, {data.teacher.first_name}!</h1>
<h2>This is your homepage</h2>
<p>
	Take a look at your current sections, add new ones, or drop sections that aren't relevant anymore.
</p>
<section>
	<h3>Sections</h3>
	<div class="sections">
		{#each data.teacher.sections as section}
			<SectionCard {section} />
		{:else}
			<p><em>You're not teaching any sections.</em></p>
		{/each}
	</div>
</section>

<style>
.sections {
	max-width: 100%;
	display: flex;
	flex-flow: row wrap;
	gap: 10px 20px;
	align-items: center;
}
</style>
