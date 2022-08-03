import prisma, { type StudentWithSections } from '$lib/prisma';
import type { RequestHandler } from './__types/[id=uuid]';

export const GET: RequestHandler<{ student: StudentWithSections }> = async ({ params }) => {
	const student = await prisma.student.findUnique({
		where: {
			id: params.id,
		},
		include: {
			sections: {
				include: {
					section: true,
				},
			},
		},
	});

	if (!student) {
		return {
			status: 404,
		};
	}

	return {
		status: 200,
		body: {
			student,
		},
	};
};
