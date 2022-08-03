import prisma, { type SectionGrades } from '$lib/prisma';
import type { Section, Student, Teacher } from '@prisma/client';
import type { RequestHandler } from './__types';

export const GET: RequestHandler<{
	students: Student[];
	teachers: Teacher[];
	sections: Section[];
	sectionGrades: SectionGrades;
}> = async () => {
	const [students, teachers, sections, sectionGrades] = await Promise.all([
		prisma.student.findMany(),
		prisma.teacher.findMany(),
		prisma.section.findMany({
			include: { _count: { select: { students: true } } },
		}),
		prisma.enrollment.groupBy({
			by: ['section_id'],
			_avg: {
				grade: true,
			},
		}),
	]);

	return {
		status: 200,
		body: {
			students,
			teachers,
			sections,
			sectionGrades,
		},
	};
};
