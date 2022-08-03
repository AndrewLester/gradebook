import type { RequestHandler } from './__types/enrollments.json';
import zfd from 'zod-form-data';
import prisma, { type EnrollmentWithStudent } from '$lib/prisma';
import type { Enrollment } from '@prisma/client';

const createSchema = zfd.formData({
	student_id: zfd.text(),
});
export const POST: RequestHandler = async ({ params, request }) => {
	const result = createSchema.safeParse(await request.formData());

	if (!result.success) {
		return {
			status: 400,
			body: 'Error',
		};
	}

	await prisma.enrollment.create({
		data: {
			section_id: params.id,
			grade: 0,
			...result.data,
		},
	});

	return {
		status: 303,
		headers: {
			location: `/sections/${params.id}`,
		},
	};
};

const deleteSchema = zfd.formData({
	student_id: zfd.text(),
});
export const DELETE: RequestHandler = async ({ params, request }) => {
	const result = deleteSchema.safeParse(await request.formData());

	if (!result.success) {
		return {
			status: 400,
			body: 'Error',
		};
	}

	await prisma.enrollment.delete({
		where: {
			student_id_section_id: {
				section_id: params.id,
				student_id: result.data.student_id,
			},
		},
	});

	return {
		status: 303,
		headers: {
			location: `/sections/${params.id}`,
		},
	};
};

const patchSchema = zfd.formData({
	student_id: zfd.text(),
	grade: zfd.numeric(),
});
export const PATCH: RequestHandler<Enrollment> = async ({ params, request }) => {
	const result = patchSchema.safeParse(await request.formData());

	if (!result.success) {
		return {
			status: 400,
		};
	}

	const enrollment = await prisma.enrollment.update({
		where: {
			student_id_section_id: {
				section_id: params.id,
				student_id: result.data.student_id,
			},
		},
		data: {
			grade: result.data.grade,
		},
	});

	return {
		status: 303,
		body: enrollment,
		headers: {
			location: `/sections/${params.id}`,
		},
	};
};

export const GET: RequestHandler<EnrollmentWithStudent[]> = async ({ params }) => {
	const enrollments = await prisma.enrollment.findMany({
		where: {
			section_id: params.id,
		},
		include: {
			student: true,
		},
	});

	if (!enrollments) {
		return {
			status: 404,
		};
	}

	return {
		status: 200,
		body: enrollments,
	};
};
