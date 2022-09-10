<script lang="ts">
import { enhance } from '$app/forms';
import Button from '$lib/components/Button.svelte';
import StudentInfo from '$lib/components/StudentInfo.svelte';
import type { PageData } from './$types';

export let data: PageData;

// Students that aren't already in the section
$: availableStudents = data.students.filter(
	(student) => !data.section.students.find(({ student: { id } }) => id === student.id)
);
</script>

<h1>{data.section.name}</h1>
<h2>A quick overview of your section</h2>
<p>Use this page to check out your section's status and students.</p>
<section>
	<h3>Students</h3>
	<ul class="students">
		{#each data.section.students as { student, grade }}
			<li>
				<StudentInfo {student} />
				-
				<form action="?/updateGrade" method="post" style:display="inline" use:enhance>
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
				<form action="?/removeStudent" method="post" style:display="inline" use:enhance>
					<input type="hidden" value={student.id} name="student_id" />
					<Button as="button">Remove</Button>
				</form>
			</li>
		{/each}
	</ul>
	<details>
		<summary>Manage</summary>
		{#if availableStudents.length > 0}
			<form action="?/addStudent" method="post" use:enhance>
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
.students {
	margin-left: 20px;
}

.students li {
	margin-bottom: 10px;
}
</style>
