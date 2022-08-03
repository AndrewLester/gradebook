<script context="module" lang="ts">
import type { Load } from './__types';

export const load: Load = async ({ fetch, props, params }) => {
	const [students, enrollments] = await Promise.all([
		fetch('/students.json').then((res) => res.json()),
		fetch(`/sections/${params.id}/enrollments.json`).then((res) => res.json()),
	]);
	return {
		props: { students, enrollments, ...props },
	};
};
</script>

<script lang="ts">
import Button from '$lib/components/Button.svelte';
import StudentInfo from '$lib/components/StudentInfo.svelte';
import { enhance } from '$lib/form';
import type { EnrollmentWithStudent } from '$lib/prisma';
import type { Section, Student } from '@prisma/client';

export let section: Section;
export let enrollments: EnrollmentWithStudent[];
export let students: Student[];

// Students that aren't already in the section
$: availableStudents = students.filter(
	(student) => !enrollments.find(({ student: { id } }) => id === student.id)
);
</script>

<h1>{section.name}</h1>
<h2>A quick overview of your section</h2>
<p>Use this page to check out your section's status and students.</p>
<section>
	<h3>Students</h3>
	<ul class="students">
		{#each enrollments as { student, grade }}
			<li>
				<StudentInfo {student} />
				-
				<form
					use:enhance={{ reset: false, refocus: false }}
					action="/sections/{section.id}/enrollments.json?_method=PATCH"
					method="post"
					name="update-grade"
					style:display="inline"
				>
					<input type="hidden" value={student.id} name="student_id" />
					<input
						type="number"
						value={grade}
						name="grade"
						style:width="50px"
						max="100"
						min="0"
						required
					/>
					<Button as="button">Save</Button>
				</form>
				<form
					use:enhance={{
						confirm: `Do you really want to remove ${student.last_name}, ${student.first_name}?`,
					}}
					action="/sections/{section.id}/enrollments.json?_method=DELETE"
					method="post"
					name="remove-student"
					style="display: inline;"
				>
					<input type="hidden" value={student.id} name="student_id" />
					<Button as="button">Remove</Button>
				</form>
			</li>
		{/each}
	</ul>
	<details>
		<summary>Manage</summary>
		{#if availableStudents.length > 0}
			<form
				use:enhance
				action="/sections/{section.id}/enrollments.json"
				method="post"
				name="add-students"
			>
				<h4>Add a student</h4>
				<p class="required">* Required</p>
				<label for="students" class="required">Select Student</label>
				<select id="students" name="student_id" required>
					{#each availableStudents as student}
						<option value={student.id}><StudentInfo {student} /></option>
					{/each}
				</select>
				<Button as="button">Add Student</Button>
			</form>
		{:else}
			<p>No available students to add to this course.</p>
		{/if}
	</details>
</section>

<style>
.students li {
	margin-bottom: 10px;
}
</style>
