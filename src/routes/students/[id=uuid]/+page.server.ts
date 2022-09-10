import prisma from '$lib/prisma';
import { error } from 'console';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
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
		throw error(404);
	}

	return {
		student,
	};
};
