<script lang="ts">
import type { Student } from '@prisma/client';

export let student: Student;
</script>

{student.last_name}, {student.first_name}{#if student.middle_initial}{` ${student.middle_initial}`}{/if}
