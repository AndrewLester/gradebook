import prisma from '$lib/prisma';
import { error, invalid, json } from '@sveltejs/kit';
import { z } from 'zod';
import zfd from 'zod-form-data';
import type { Action, Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [students, teachers, sections, sectionGrades] = await Promise.all([
		prisma.student.findMany(),
		prisma.teacher.findMany(),
		prisma.section.findMany({
			include: { _count: { select: { students: true } } },
		}),
		prisma.enrollment.groupBy({
			by: ['section_id'],
			_avg: {
				grade: true,
			},
		}),
	]);

	return {
		students,
		teachers,
		sections,
		sectionGrades,
	};
};

const createSectionSchema = zfd.formData({
	name: zfd.text(),
	teacher_id: zfd.text(),
});
const createSection: Action = async ({ request }) => {
	const result = createSectionSchema.safeParse(await request.formData());

	if (!result.success) {
		return invalid(400);
	}

	await prisma.section.create({
		data: result.data,
	});
};

const createStudentSchema = zfd.formData({
	first_name: zfd.text(),
	last_name: zfd.text(),
	middle_initial: zfd.text(z.string().max(1).optional()),
});

export const createStudent: Action = async ({ request }) => {
	const result = createStudentSchema.safeParse(await request.formData());

	if (!result.success) {
		return invalid(400);
	}

	await prisma.student.create({
		data: result.data,
	});
};

const createTeacherSchema = zfd.formData({
	first_name: zfd.text(),
	last_name: zfd.text(),
	middle_initial: zfd.text(z.string().max(1).optional()),
});
export const createTeacher: Action = async ({ request }) => {
	const result = createTeacherSchema.safeParse(await request.formData());

	if (!result.success) {
		return invalid(400);
	}

	await prisma.teacher.create({
		data: result.data,
	});
};

export const actions: Actions = {
	createSection,
	createStudent,
	createTeacher,
};
