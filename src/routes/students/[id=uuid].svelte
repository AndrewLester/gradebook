<script lang="ts">
import type { StudentWithSections } from '$lib/prisma';

export let student: StudentWithSections;

$: gpa = student.sections.reduce((sum, cur) => sum + cur.grade, 0) / student.sections.length;
</script>

<h1>Hi, {student.first_name}</h1>
<h2>Take a look at your courses</h2>
<p>Here you'll find all the courses you're registered for, along with your grade for each one.</p>
<p><strong>Overall GPA</strong>: {gpa}</p>
<section>
	<h3>Courses</h3>
	{#if student.sections.length > 0}
		<ul>
			{#each student.sections as section}
				<li>{section.section.name} - {section.grade}</li>
			{/each}
		</ul>
	{/if}
</section>
