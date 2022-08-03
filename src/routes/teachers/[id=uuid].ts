import prisma, { type TeacherWithSectionsAndSectionsWithStudents } from '$lib/prisma';
import type { RequestHandler } from './__types/[id=uuid]';

export const GET: RequestHandler<{ teacher: TeacherWithSectionsAndSectionsWithStudents }> = async ({
	params,
}) => {
	const teacher = await prisma.teacher.findUnique({
		where: {
			id: params.id,
		},
		include: {
			sections: {
				include: {
					students: {
						include: {
							student: true,
						},
					},
				},
			},
		},
	});

	if (!teacher) {
		return {
			status: 404,
		};
	}

	return {
		status: 200,
		body: {
			teacher,
		},
	};
};
