<script context="module" lang="ts">
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
	const [students, teachers, sections, sectionGrades] = await Promise.all([
		fetch('/students.json').then((res) => res.json()),
		fetch('/teachers.json').then((res) => res.json()),
		fetch('/sections.json').then((res) => res.json()),
		fetch('/sections/grades.json').then((res) => res.json()),
	]);

	return {
		props: {
			students,
			teachers,
			sections,
			sectionGrades,
		},
	};
};
</script>

<script lang="ts">
import Button from '$lib/components/Button.svelte';
import type { SectionGrades, SectionWithStudentCount } from '$lib/prisma';
import type { Student, Teacher } from '@prisma/client';
import { enhance } from '$lib/form';
import StudentInfo from '$lib/components/StudentInfo.svelte';

export let students: Student[];
export let teachers: Teacher[];
export let sections: SectionWithStudentCount[];
export let sectionGrades: SectionGrades;
$: sectionGradesMap = sectionGrades.reduce(
	(obj, cur) => ((obj[cur.section_id] = cur._avg.grade ?? 0), obj),
	{} as Record<string, number>
);
</script>

<h1>Administration</h1>
<h2>Take care of administrative tasks here</h2>
<p>You can use this dashboard to manage all of the school's students, teachers, and sections.</p>
<section>
	<h3>Students</h3>
	{#each students as student}
		<p>
			<a href="/students/{student.id}" sveltekit:prefetch
				><StudentInfo {student} />.
				{new Date(student.created_at).toDateString()}</a
			>
		</p>
	{/each}
	<details>
		<summary>Manage</summary>
		<form use:enhance action="/students.json" method="post" name="students">
			<h4>Add a student</h4>
			<p class="required">* Required</p>
			<label for="first-name" class="required">First name</label>
			<input id="first-name" type="text" name="first_name" required />
			<label for="last-name" class="required">Last name</label>
			<input id="last-name" type="text" name="last_name" required />
			<label for="middle-initial">Middle initial</label>
			<input id="middle-initial" type="text" name="middle_initial" maxlength="1" />
			<Button as="button">Create Student</Button>
		</form>
	</details>
</section>

<section>
	<h3>Teachers</h3>
	{#each teachers as teacher}
		<p>
			<a href="/teachers/{teacher.id}" sveltekit:prefetch
				>{teacher.last_name}, {teacher.first_name}{#if teacher.middle_initial}
					{teacher.middle_initial}{/if}. {new Date(teacher.created_at).toDateString()}</a
			>
		</p>
	{/each}
	<details>
		<summary>Manage</summary>
		<form use:enhance action="/teachers.json" method="post" name="teachers">
			<h4>Add a teacher</h4>
			<p class="required">* Required</p>
			<label for="first-name" class="required">First name</label>
			<input id="first-name" type="text" name="first_name" required />
			<label for="last-name" class="required">Last name</label>
			<input id="last-name" type="text" name="last_name" required />
			<label for="middle-initial">Middle initial</label>
			<input id="middle-initial" type="text" name="middle_initial" maxlength="1" />
			<Button as="button">Create Teacher</Button>
		</form>
	</details>
</section>

<section>
	<h3>Sections</h3>
	{#each sections as section}
		<p>
			<a href="/sections/{section.id}" sveltekit:prefetch
				>{section.name}. {section._count.students} enrolled. {sectionGradesMap[section.id]} GPA. {new Date(
					section.created_at
				).toDateString()}</a
			>
		</p>
	{/each}
	<details>
		<summary>Manage</summary>
		<form use:enhance action="/sections.json" method="post" name="sections">
			<h4>Add a section</h4>
			<p class="required">* Required</p>
			<label for="name" class="required">Name</label>
			<input id="name" type="text" name="name" required />
			<label for="teacher_id" class="required">Teacher</label>
			<select id="teacher_id" name="teacher_id" required>
				{#each teachers as teacher}
					<option value={teacher.id} name={teacher.id}
						>{teacher.last_name}, {teacher.first_name}</option
					>
				{/each}
			</select>
			<Button as="button">Create Section</Button>
		</form>
	</details>
</section>

<style>
input {
	display: block;
	margin-bottom: var(--section-padding);
}
</style>
