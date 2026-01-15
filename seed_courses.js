
const { PrismaClient } = require('./lib/generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    // Find the first user (most likely the current user in dev)
    const user = await prisma.user.findFirst();

    if (!user) {
        console.log("No user found! Please sign in first.");
        return;
    }

    console.log(`Found user: ${user.name} (${user.id})`);

    // Create 5 dummy courses
    const coursesToCreate = [
        "Introduction to AI",
        "Python Mastery",
        "Web Dev Bootcamp",
        "Data Science Basics",
        "Machine Learning 101"
    ];

    for (const title of coursesToCreate) {
        await prisma.course.create({
            data: {
                courseId: title.toLowerCase().replace(/ /g, '-'),
                courseName: title,
                courseDescription: "Recovered legacy course content.",
                level: "Beginner",
                totalChapters: 2,
                userId: user.id,
                chapters: {
                    create: [
                        {
                            chapterId: "legacy-chapter-1",
                            chapterTitle: "Introduction",
                            subContent: ["Topic 1", "Topic 2"]
                        },
                        {
                            chapterId: "legacy-chapter-2",
                            chapterTitle: "Deep Dive",
                            subContent: ["Topic 3", "Topic 4"]
                        }
                    ]
                }
            }
        });
    }

    console.log("Successfully restored 5 courses!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
