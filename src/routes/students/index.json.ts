import prisma from '$lib/prisma';
import type { Student } from '@prisma/client';
import type { RequestHandler } from './__types/index.json';
import zfd from 'zod-form-data';
import { z } from 'zod';

export const GET: RequestHandler<Student[]> = async () => {
	const students = await prisma.student.findMany();

	return {
		status: 200,
		body: students,
	};
};

const schema = zfd.formData({
	first_name: zfd.text(),
	last_name: zfd.text(),
	middle_initial: zfd.text(z.string().max(1).optional()),
});

export const POST: RequestHandler<Student | string> = async ({ request }) => {
	const result = schema.safeParse(await request.formData());

	if (!result.success) {
		return {
			status: 303,
			body: result.error.message,
			headers: {
				location: '/admin',
			},
		};
	}

	const student = await prisma.student.create({
		data: result.data,
	});

	return {
		status: 303,
		body: student,
		headers: {
			location: '/admin',
		},
	};
};
