import prisma, { type SectionGrades } from '$lib/prisma';
import type { RequestHandler } from './__types/grades.json';

export const GET: RequestHandler<SectionGrades> = async () => {
	const sectionGrades = await prisma.enrollment.groupBy({
		by: ['section_id'],
		_avg: {
			grade: true,
		},
	});
	return {
		status: 200,
		body: sectionGrades,
	};
};
