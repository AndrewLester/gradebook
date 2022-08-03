<script lang="ts">
import Button from '$lib/components/Button.svelte';
import StudentInfo from '$lib/components/StudentInfo.svelte';
import { enhance } from '$lib/form';
import type {
	EnrollmentWithStudent,
	TeacherWithSectionsAndSectionsWithStudents,
} from '$lib/prisma';
import type { Section } from '@prisma/client';

export let section: Section | TeacherWithSectionsAndSectionsWithStudents['sections'][number];
export let enrollments: EnrollmentWithStudent[] = [];
export let controls = true;

$: students = 'students' in section ? section.students : enrollments;
</script>

<div class="wrapper">
	<a href="/sections/{section.id}" sveltekit:prefetch>
		{section.name}
	</a>
	{#if students.length > 0}
		<ul>
			{#each students as { student }}
				<li><StudentInfo {student} /></li>
			{/each}
		</ul>
	{:else}
		<p><em>No students</em></p>
	{/if}
	{#if controls}
		<form use:enhance action="/sections.json?_method=DELETE" method="post" name="drop-section">
			<input type="hidden" value={section.id} name="id" />
			<Button as="button">Drop</Button>
		</form>
	{/if}
</div>

<style>
.wrapper {
	border-radius: var(--pill-radius);
	border: 1px solid var(--surface-lightest);
	background-color: var(--surface-lighter);
	padding: 50px;
	max-width: 75ch;
}
</style>
