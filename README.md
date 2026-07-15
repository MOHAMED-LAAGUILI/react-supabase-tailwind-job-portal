![alt text](image.png)
![alt text](image-1.png)



# 🛠️ Supabase Infrastructure Setup

Before running the application, complete the following setup in your **Supabase** and **Clerk** dashboards.

---
## link supabase with clerk
https://clerk.com/docs/guides/development/integrations/databases/supabase
## 1. Execute the Database Migrations



The required SQL files are located in:

```text
src/utils/
```

Open **Supabase Dashboard → SQL Editor** and execute each file **in the following order**:

```text
01-profiles.sql
02-companies.sql
03-jobs.sql
04-applications.sql
05-saved_jobs.sql
```

> ⚠️ Running the files out of order may cause foreign key or dependency errors.

---

## 2. Create Storage Buckets

Navigate to **Supabase Dashboard → Storage** and create the following **Public** buckets:

| Bucket | Purpose |
|---------|---------|
| `company-logo` | Store company logos |
| `resumes` | Store candidate resumes |

---

## 3. Configure Clerk JWT Authentication

Open **Clerk Dashboard → JWT Templates** and create a new template with the following settings:

| Setting | Value |
|---------|-------|
| **Template Name** | `supabase` |
| **Algorithm** | `HS256` |
| **Signing Key** | Your Supabase JWT Secret |

You can find your JWT Secret in:

```text
Supabase Dashboard
→ Settings
→ API
→ JWT Settings
```

---

## ✅ Verification Checklist

- [ ] All SQL migration files executed successfully
- [ ] `company-logo` storage bucket created (Public)
- [ ] `resumes` storage bucket created (Public)
- [ ] Clerk `supabase` JWT template configured

Once these steps are complete, the application will be fully configured and features such as **authentication**, **company management**, **job creation**, **applications**, and **resume uploads** will work end-to-end.



