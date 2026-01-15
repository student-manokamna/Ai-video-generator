
const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const courses = await prisma.course.findMany({
        include: { user: true }
    });

    console.log("Users:", userCount);
    console.log("Courses:", courseCount);
    console.log("Courses Data:", JSON.stringify(courses, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
