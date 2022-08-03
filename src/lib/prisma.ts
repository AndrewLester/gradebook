import PrismaWrapper, { Prisma as PrismaType } from '@prisma/client';
const { PrismaClient, Prisma } = PrismaWrapper;

const prisma = new PrismaClient();

const teacherWithSectionsAndSectionsWithStudents = Prisma.validator<PrismaType.TeacherArgs>()({
	include: { sections: { include: { students: { include: { student: true } } } } },
});
export type TeacherWithSectionsAndSectionsWithStudents = PrismaType.TeacherGetPayload<
	typeof teacherWithSectionsAndSectionsWithStudents
>;

const studentWithSections = Prisma.validator<PrismaType.StudentArgs>()({
	include: { sections: { include: { section: true } } },
});
export type StudentWithSections = PrismaType.StudentGetPayload<typeof studentWithSections>;

const sectionWithStudentCount = Prisma.validator<PrismaType.SectionArgs>()({
	include: { _count: { select: { students: true } } },
});
export type SectionWithStudentCount = PrismaType.SectionGetPayload<typeof sectionWithStudentCount>;

const enrollmentWithStudent = Prisma.validator<PrismaType.EnrollmentArgs>()({
	include: {
		student: true,
	},
});
export type EnrollmentWithStudent = PrismaType.EnrollmentGetPayload<typeof enrollmentWithStudent>;

const sectionGrades = Prisma.validator<PrismaType.EnrollmentGroupByArgs>()({
	by: ['section_id'],
	_avg: { grade: true },
});
export type SectionGrades = Awaited<PrismaType.GetEnrollmentGroupByPayload<typeof sectionGrades>>;

export default prisma;
