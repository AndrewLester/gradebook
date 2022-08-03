import prisma from '$lib/prisma';
import type { Teacher } from '@prisma/client';
import { z } from 'zod';
import zfd from 'zod-form-data';
import type { RequestHandler } from './__types/index.json';

export const GET: RequestHandler<Teacher[]> = async () => {
	const teachers = await prisma.teacher.findMany();

	return {
		status: 200,
		body: teachers,
	};
};

const createSchema = zfd.formData({
	first_name: zfd.text(),
	last_name: zfd.text(),
	middle_initial: zfd.text(z.string().max(1).optional()),
});
export const POST: RequestHandler = async ({ request }) => {
	const result = createSchema.safeParse(await request.formData());

	if (!result.success) {
		return {
			status: 400,
			body: 'Error',
		};
	}

	const teacher = await prisma.teacher.create({
		data: result.data,
	});

	return {
		status: 303,
		body: teacher,
		headers: {
			location: '/admin',
		},
	};
};
