import prisma, { type SectionWithStudentCount } from '$lib/prisma';
import zfd from 'zod-form-data';
import type { RequestHandler } from './__types/index.json';

export const GET: RequestHandler<SectionWithStudentCount[]> = async () => {
	const sectionsWithStudentCount = await prisma.section.findMany({
		include: { _count: { select: { students: true } } },
	});
	return {
		status: 200,
		body: sectionsWithStudentCount,
	};
};

const createSchema = zfd.formData({
	name: zfd.text(),
	teacher_id: zfd.text(),
});
export const POST: RequestHandler = async ({ request }) => {
	const result = createSchema.safeParse(await request.formData());

	if (!result.success) {
		return {
			status: 400,
			body: 'Error',
		};
	}

	const section = await prisma.section.create({
		data: result.data,
	});

	return {
		status: 303,
		body: section,
		headers: {
			location: '/admin',
		},
	};
};

const deleteSchema = zfd.formData({
	id: zfd.text(),
});
export const DELETE: RequestHandler = async ({ request }) => {
	const result = deleteSchema.safeParse(await request.formData());

	if (!result.success) {
		return {
			status: 400,
			body: 'Error',
		};
	}

	await prisma.enrollment.deleteMany({
		where: {
			section_id: result.data.id,
		},
	});

	await prisma.section.delete({
		where: {
			id: result.data.id,
		},
	});

	return {
		status: 303,
		headers: {
			location: `/admin`,
		},
	};
};
