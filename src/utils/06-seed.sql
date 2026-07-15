-- ==========================================================
-- SEED DATA
-- Run AFTER all 5 schema files (01 → 05).
-- Replace placeholder Clerk user IDs with your real IDs.
-- ==========================================================

-- === PROFILES ===
-- Use your actual Clerk user IDs from https://dashboard.clerk.com → Users
-- You can see your ID in the browser console: (await Clerk.user?.id)
INSERT INTO profiles (id, role) VALUES
  ('user_xxxxxxxxxxxxxxxxx', 'recruiter'),   -- ← REPLACE with your Clerk user ID
  ('user_yyyyyyyyyyyyyyyyy', 'candidate');   -- ← REPLACE with a candidate's Clerk user ID

-- === COMPANIES ===
INSERT INTO companies (name, logo_url) VALUES
  ('Acme Corp', 'https://placehold.co/200x200/2563eb/ffffff?text=ACME'),
  ('TechMorocco', 'https://placehold.co/200x200/059669/ffffff?text=TM'),
  ('DataFlow Solutions', 'https://placehold.co/200x200/dc2626/ffffff?text=DFS'),
  ('GreenEnergy MA', 'https://placehold.co/200x200/65a30d/ffffff?text=GEMA'),
  ('MediSecure', 'https://placehold.co/200x200/7c3aed/ffffff?text=MED');

-- === JOBS ===
-- recruiter_id must match the Clerk user ID you set above
INSERT INTO jobs (title, description, location, requirements, company_id, recruiter_id, "isOpen") VALUES
  (
    'Senior Frontend Developer',
    'We are looking for an experienced Frontend Developer to join our team and build modern web applications using React and TypeScript. You will work closely with our design team to create pixel-perfect, responsive interfaces.',
    'Casablanca-Settat',
    '### Requirements\n\n- 4+ years of experience with React\n- Strong TypeScript skills\n- Experience with Tailwind CSS\n- Familiarity with modern build tools (Vite, Webpack)\n- Good communication skills in English & French\n\n### Nice to have\n\n- Experience with Next.js\n- Knowledge of animation libraries (Framer Motion)\n- Open source contributions',
    1,
    'user_xxxxxxxxxxxxxxxxx',
    TRUE
  ),
  (
    'Backend Engineer (Node.js)',
    'Join our engineering team to design and build scalable APIs and microservices. You will own critical backend services that power our platform.',
    'Rabat-Salé-Kénitra',
    '### Requirements\n\n- 3+ years of Node.js experience\n- Strong SQL skills (PostgreSQL preferred)\n- Experience with REST API design\n- Understanding of message queues (RabbitMQ, Kafka)\n\n### Nice to have\n\n- TypeScript experience\n- Knowledge of Docker/Kubernetes\n- Experience with Supabase or Firebase',
    2,
    'user_xxxxxxxxxxxxxxxxx',
    TRUE
  ),
  (
    'Product Designer',
    'We are seeking a talented Product Designer to create intuitive, beautiful user experiences. You will own the design process from research to high-fidelity mockups.',
    'Marrakech-Safi',
    '### Requirements\n\n- 3+ years of UX/UI design experience\n- Proficiency in Figma\n- Strong portfolio showcasing web/mobile designs\n- Understanding of design systems\n\n### Nice to have\n\n- Motion design skills\n- User research experience\n- Frontend development knowledge (HTML/CSS)',
    3,
    'user_xxxxxxxxxxxxxxxxx',
    TRUE
  ),
  (
    'Data Engineer',
    'Help us build and maintain our data infrastructure. You will work with large datasets, build ETL pipelines, and ensure data quality across the organization.',
    'Casablanca-Settat',
    '### Requirements\n\n- 3+ years in data engineering\n- Proficiency in Python\n- Experience with SQL and data warehousing\n- Knowledge of ETL pipelines\n\n### Nice to have\n\n- Experience with Apache Spark\n- Cloud platform experience (AWS/GCP)\n- Knowledge of dbt or Airflow',
    3,
    'user_xxxxxxxxxxxxxxxxx',
    TRUE
  ),
  (
    'DevOps Engineer',
    'We are looking for a DevOps Engineer to manage and improve our cloud infrastructure. You will ensure high availability, security, and scalability of our systems.',
    'Tanger-Tétouan-Al Hoceïma',
    '### Requirements\n\n- 3+ years of DevOps experience\n- Strong knowledge of Linux\n- Experience with Docker & Kubernetes\n- Infrastructure as Code (Terraform)\n\n### Nice to have\n\n- Experience with CI/CD pipelines\n- Monitoring & observability tools (Prometheus, Grafana)\n- Cloud certifications (AWS/Azure/GCP)',
    1,
    'user_xxxxxxxxxxxxxxxxx',
    TRUE
  ),
  (
    'Marketing Manager',
    'Lead our marketing efforts to drive brand awareness and customer acquisition. You will develop and execute marketing strategies across multiple channels.',
    'Marrakech-Safi',
    '### Requirements\n\n- 5+ years of marketing experience\n- Proven track record in B2B marketing\n- Excellent written and verbal communication\n- Experience with digital marketing tools\n\n### Nice to have\n\n- Experience in the tech industry\n- SEO/SEM expertise\n- French & Arabic language skills',
    4,
    'user_xxxxxxxxxxxxxxxxx',
    TRUE
  ),
  (
    'Full Stack Developer',
    'Join our fast-growing team to build end-to-end features. You will work on both frontend and backend, delivering value to customers every week.',
    'Fès-Meknès',
    '### Requirements\n\n- 2+ years of full stack experience\n- Proficiency in React or Vue.js\n- Backend experience with Node.js or Python\n- Database design skills\n\n### Nice to have\n\n- Experience with TypeScript\n- Knowledge of cloud services\n- Startup experience',
    4,
    'user_xxxxxxxxxxxxxxxxx',
    FALSE
  ),
  (
    'QA Engineer',
    'We are looking for a meticulous QA Engineer to ensure the quality of our products. You will design test strategies, write test cases, and automate testing.',
    'Casablanca-Settat',
    '### Requirements\n\n- 2+ years of QA experience\n- Experience with automated testing frameworks\n- Strong analytical skills\n- Knowledge of CI/CD pipelines\n\n### Nice to have\n\n- Performance testing experience\n- Security testing knowledge\n- ISTQB certification',
    5,
    'user_xxxxxxxxxxxxxxxxx',
    TRUE
  ),
  (
    'HR Coordinator',
    'Support our growing team by managing recruitment processes, employee relations, and administrative tasks. You will be the first point of contact for HR matters.',
    'Rabat-Salé-Kénitra',
    '### Requirements\n\n- 2+ years of HR experience\n- Knowledge of Moroccan labor law\n- Excellent interpersonal skills\n- Proficiency in French, Arabic & English\n\n### Nice to have\n\n- Experience with HRIS systems\n- Recruitment experience\n- HR certification',
    2,
    'user_xxxxxxxxxxxxxxxxx',
    TRUE
  );

-- === SAMPLE APPLICATIONS ===
-- user_id must match a candidate's Clerk user ID
-- job_id references the jobs above (1–9)
-- resume is a placeholder URL
INSERT INTO applications (user_id, job_id, name, experience, education, skills, resume, status) VALUES
  ('user_yyyyyyyyyyyyyyyyy', 1, 'Ahmed Benali', '5', 'Graduate', 'React, TypeScript, Tailwind CSS, Next.js', 'https://placehold.co/600x400/eeeeee/999999?text=resume.pdf', 'applied'),
  ('user_yyyyyyyyyyyyyyyyy', 3, 'Ahmed Benali', '5', 'Graduate', 'Figma, UX Research, Prototyping, Design Systems', 'https://placehold.co/600x400/eeeeee/999999?text=resume.pdf', 'interviewing'),
  ('user_yyyyyyyyyyyyyyyyy', 7, 'Ahmed Benali', '5', 'Graduate', 'React, Node.js, PostgreSQL, TypeScript', 'https://placehold.co/600x400/eeeeee/999999?text=resume.pdf', 'applied');

-- === SAVED JOBS ===
INSERT INTO saved_jobs (user_id, job_id) VALUES
  ('user_yyyyyyyyyyyyyyyyy', 2),
  ('user_yyyyyyyyyyyyyyyyy', 5);
