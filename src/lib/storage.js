import { get, set, update } from 'idb-keyval';

const STORE_KEY = 'ats_jobs';
const SKILLS_KEY = 'ats_skills';

// Initialize store if empty
export async function initStorage() {
  const jobs = await get(STORE_KEY);
  if (!jobs) {
    await set(STORE_KEY, []);
  }
}

export async function getJobs() {
  return (await get(STORE_KEY)) || [];
}

export async function saveJob(job) {
  await update(STORE_KEY, (val) => {
    const jobs = val || [];
    const existingIndex = jobs.findIndex(j => j.id === job.id);
    if (existingIndex >= 0) {
      jobs[existingIndex] = job;
      return [...jobs];
    }
    return [job, ...jobs];
  });
}

export async function deleteJob(id) {
  await update(STORE_KEY, (val) => {
    const jobs = val || [];
    return jobs.filter(j => j.id !== id);
  });
}

export async function getJob(id) {
  const jobs = await getJobs();
  return jobs.find(j => j.id === id);
}

// Skills Storage
export async function getSkills() {
  return (await get(SKILLS_KEY)) || [];
}

export async function saveSkill(skill) {
  await update(SKILLS_KEY, (val) => {
    const skills = val || [];
    const existingIndex = skills.findIndex(s => s.id === skill.id);
    if (existingIndex >= 0) {
      skills[existingIndex] = skill;
      return [...skills];
    }
    return [...skills, skill];
  });
}

export async function deleteSkill(id) {
  await update(SKILLS_KEY, (val) => {
    const skills = val || [];
    return skills.filter(s => s.id !== id);
  });
}

// Helper to download file from blob directly
export function downloadFile(fileObj) {
  if (!fileObj || !fileObj.data) return;

  const blob = fileObj.data instanceof Blob ? fileObj.data : new Blob([fileObj.data]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileObj.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
