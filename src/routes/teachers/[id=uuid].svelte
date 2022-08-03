<script context="module" lang="ts">
import type { Load } from './__types/[id=uuid]';

export const load: Load = ({ props }) => {
	return {
		props,
		dependencies: ['/sections.json'],
	};
};
</script>

<script lang="ts">
import SectionCard from '$lib/components/SectionCard.svelte';
import type { TeacherWithSectionsAndSectionsWithStudents } from '$lib/prisma';

export let teacher: TeacherWithSectionsAndSectionsWithStudents;
</script>

<h1>Hi, {teacher.first_name}!</h1>
<h2>This is your homepage</h2>
<p>
	Take a look at your current sections, add new ones, or drop sections that aren't relevant anymore.
</p>
<section>
	<h3>Sections</h3>
	<div class="sections">
		{#each teacher.sections as section}
			<SectionCard {section} />
		{/each}
	</div>
</section>

<style>
.sections {
	display: flex;
	align-items: center;
}
</style>
