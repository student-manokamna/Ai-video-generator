import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

// Helper to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch user's courses
  const courses = await prisma.course.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: { chapters: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Profile Header */}
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-800">
          <div className="flex items-center gap-6">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover dark:border-blue-900/30"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {(session.user.name?.[0] || 'U').toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {session.user.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {session.user.email}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                <span>Member since {formatDate(session.user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Courses Section */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            My Courses ({courses.length})
          </h2>

          {courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.courseId}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {course.level}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(course.createdAt)}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {course.courseName}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {course.courseDescription}
                    </p>

                    <div className="mt-auto flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {course._count.chapters} Chapters
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 dark:bg-neutral-700/50">
                    <span className="text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-400">
                      Continue Learning →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                No courses yet
              </h3>
              <p className="mb-6 text-gray-500 dark:text-gray-400">
                Create your first AI-generated course to get started!
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Generate New Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;