// All site content lives here. Components only render it.

export const profile = {
  name: 'Jems Mainali',
  tagline: 'Full-stack developer. I build web apps from the database up.',
  location: 'Kathmandu',
  status: 'Open to junior developer roles',
  email: 'jemsmainali@gmail.com',
  site: 'https://nischal-mainali.onrender.com',
}

export const links = [
  { label: 'GitHub', href: 'https://github.com/jemsmainali' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nischal-mainali' },
  { label: 'Instagram', href: 'https://www.instagram.com/jems.goddam.mainali?igsh=OTM5M3N6amdkenl1' },
]

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const about = {
  paragraphs: [
    "I'm a BCIS student at Medhavi College, Pokhara University, and I live in Kathmandu.",
    'I work across the stack: React and Tailwind on the front end, Django or FastAPI for the API, and PostgreSQL or SQLite underneath. I have built a client project, my final-year project and team projects this way.',
  ],
  facts: [
    { label: 'Based in', value: 'Kathmandu, Nepal' },
    { label: 'Studying', value: 'BCIS, Medhavi College (Pokhara University)' },
    { label: 'Looking for', value: 'Junior developer roles' },
  ],
}

export const projects = [
  {
    title: 'VN Consultancy',
    kind: 'Client project',
    summary:
      'A records system for a consultancy. Students and colleges send their documents, and the consultancy keeps the records and replies to them.',
    points: ['React and Tailwind front end', 'FastAPI back end with JWT sign-in', 'PostgreSQL for the records'],
    stack: ['React', 'Tailwind CSS', 'FastAPI', 'PostgreSQL', 'JWT'],
  },
  {
    title: 'Gymfied',
    kind: 'BCIS final project',
    summary: 'A gym and diet planner. It is my final-year project for BCIS.',
    points: ['Django back end', 'React front end', 'SQLite database'],
    stack: ['Django', 'React', 'SQLite'],
    link: { label: 'Code on GitHub', href: 'https://github.com/jemsmainali/Diet-Workout-planner' },
  },
  {
    title: 'Questionbank',
    kind: 'Team project',
    summary: 'An API built with Django REST Framework as part of a team.',
    points: [
      'Organised the Swagger docs with tags',
      'Fixed broken migrations',
      'Added bookmarks, plus the ContactUs and pages apps',
    ],
    stack: ['Django REST Framework', 'Swagger'],
  },
  {
    title: 'AWS online exam system',
    kind: 'Group assignment',
    summary: 'An online exam system on AWS, designed for 10,000 students.',
    points: ['Planned as a group assignment', 'Designed to serve 10,000 students'],
    stack: ['AWS'],
  },
]

export const moreRepos = [
  { label: 'Flask', href: 'https://github.com/jemsmainali/Flask' },
  { label: 'Task-Management', href: 'https://github.com/jemsmainali/Task-Management' },
  { label: 'Internship-py', href: 'https://github.com/jemsmainali/Internship-py' },
  { label: 'This site', href: 'https://github.com/jemsmainali/portfolioself' },
]

export const experience = [
  {
    period: 'Jan – Mar 2026',
    role: 'Python Developer Intern',
    org: 'Online Notes Nepal',
    points: ['Built APIs with Django REST Framework', 'Wrote the API documentation'],
  },
  {
    period: '2023',
    role: 'Computer Science Intern',
    org: 'Siddhartha Vidyapeeth School',
    points: [],
  },
  {
    period: 'Degree',
    role: 'BCIS',
    org: 'Medhavi College, Pokhara University',
    points: ['Final project: Gymfied, a gym and diet planner'],
  },
]

// Only tools used in the projects above.
export const skills = [
  { group: 'Frontend', items: ['React', 'Tailwind CSS'] },
  { group: 'Backend', items: ['Django', 'Django REST Framework', 'FastAPI', 'JWT'] },
  { group: 'Database', items: ['PostgreSQL', 'SQLite'] },
  { group: 'Tools', items: ['AWS', 'Swagger'] },
]

export const stackLayers = ['Frontend', 'API', 'Database']
