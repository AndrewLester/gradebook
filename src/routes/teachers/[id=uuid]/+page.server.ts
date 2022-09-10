import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
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
		throw error(404);
	}

	return {
		teacher,
	};
};
