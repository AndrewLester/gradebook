import prisma from '$lib/prisma';
import { error, invalid } from '@sveltejs/kit';
import zfd from 'zod-form-data';
import type { Action, Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [section, students] = await Promise.all([
		prisma.section.findUnique({
			where: {
				id: params.id,
			},
			include: {
				students: {
					include: {
						student: true,
					},
				},
			},
		}),
		prisma.student.findMany(),
	]);

	if (!section) {
		throw error(404);
	}

	return {
		section,
		students,
	};
};

const addStudentSchema = zfd.formData({
	student_id: zfd.text(),
});
const addStudent: Action = async ({ params, request }) => {
	const result = addStudentSchema.safeParse(await request.formData());

	if (!result.success) {
		return invalid(400);
	}

	await prisma.enrollment.create({
		data: {
			section_id: params.id,
			grade: 0,
			...result.data,
		},
	});
};
const removeStudentSchema = zfd.formData({
	student_id: zfd.text(),
});
const removeStudent: Action = async ({ params, request }) => {
	const result = removeStudentSchema.safeParse(await request.formData());

	if (!result.success) {
		return invalid(400);
	}

	await prisma.enrollment.delete({
		where: {
			student_id_section_id: {
				section_id: params.id,
				student_id: result.data.student_id,
			},
		},
	});
};

const updateGradeSchema = zfd.formData({
	student_id: zfd.text(),
	grade: zfd.numeric(),
});
const updateGrade: Action = async ({ params, request }) => {
	const result = updateGradeSchema.safeParse(await request.formData());

	if (!result.success) {
		return invalid(400);
	}

	await prisma.enrollment.update({
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
};

const deleteSection: Action = async ({ params }) => {
	await prisma.section.delete({
		where: {
			id: params.id,
		},
	});
};

export const actions: Actions = {
	addStudent,
	removeStudent,
	updateGrade,
	deleteSection,
};
