import prisma from '$lib/prisma';
import type { Section } from '@prisma/client';
import type { RequestHandler } from './__types';

export const GET: RequestHandler<{ section: Section }> = async ({ params }) => {
	const section = await prisma.section.findUnique({
		where: {
			id: params.id,
		},
	});

	if (!section) {
		return {
			status: 404,
		};
	}

	return {
		status: 200,
		body: {
			section,
		},
	};
};
