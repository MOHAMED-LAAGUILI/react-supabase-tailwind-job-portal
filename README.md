# Tuturial
https://www.youtube.com/watch?v=2XF-HgauItk


![alt text](image.png)
![alt text](image-1.png)



# Infra Setup You Must Do (in Supabase Dashboard)
These SQL files exist in src/utils/ but need to be executed in order:

Open Supabase SQL Editor → Paste & run each file in order:
01-profiles.sql
02-companies.sql
03-jobs.sql
04-applications.sql
05-saved_jobs.sql
Create Storage buckets (public):
company-logo — for company logos
resumes — for candidate resumes
Configure Clerk → Supabase JWT in Clerk Dashboard → JWT Templates:
Create a template named supabase
Algorithm: HS256
Signing key: Paste your Supabase JWT Secret (from Supabase Dashboard → Settings → API → JWT Settings)
Once those 3 steps are done, company + job creation will work end-to-end.