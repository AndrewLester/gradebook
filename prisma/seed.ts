import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	const teacherUUID = '7eba7f32-cda3-46ef-b8f0-21e2256a65a3';
	const courseUUID = '29a84b51-911c-42db-a6c4-b9aa71757dd8';
	const studentUUID = 'b8b92735-0448-421d-8422-52e00456c32a';

	const teacher = await prisma.teacher.upsert({
		where: { id: teacherUUID },
		update: {},
		create: {
			id: teacherUUID,
			first_name: 'teacher',
			last_name: 'teach',
			created_at: new Date(),
		},
	});

	const math = await prisma.section.upsert({
		where: { id: courseUUID },
		update: {},
		create: {
			id: courseUUID,
			name: 'Computer Science',
			created_at: new Date(),
			teacher_id: teacher.id,
		},
	});

	await prisma.student.upsert({
		where: { id: studentUUID },
		update: {},
		create: {
			id: studentUUID,
			first_name: 'student',
			last_name: 'stu',
			created_at: new Date(),
			sections: {
				create: {
					grade: 0,
					section_id: math.id,
				},
			},
		},
	});
}

try {
	await main();
	await prisma.$disconnect();
} catch (e) {
	console.log(e);
	await prisma.$disconnect();
	process.exit(1);
}
