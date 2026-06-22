// Client-side helpers for managing course access

export async function getStudentCourses(): Promise<string[]> {
  try {
    const response = await fetch('/api/courses/my-access');
    if (!response.ok) throw new Error('Failed to fetch courses');
    const { courseIds } = await response.json();
    return courseIds || [];
  } catch (err) {
    console.error('Error fetching courses:', err);
    return [];
  }
}

export async function grantStudentCourses(
  studentId: string,
  courseIds: string[]
): Promise<boolean> {
  try {
    const response = await fetch('/api/courses/grant-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseIds }),
    });
    if (!response.ok) throw new Error('Failed to grant access');
    return true;
  } catch (err) {
    console.error('Error granting access:', err);
    return false;
  }
}

export async function recordProgress(
  courseId: string,
  lessonId: string,
  score: number,
  type: 'lesson' | 'quiz'
): Promise<boolean> {
  try {
    const response = await fetch('/api/progress/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, lessonId, score, type }),
    });
    if (!response.ok) throw new Error('Failed to record progress');
    return true;
  } catch (err) {
    console.error('Error recording progress:', err);
    return false;
  }
}
