## 2. ERD (Entity Relationship Diagram)

Skema dipecah menjadi tiga diagram per kelompok agar terbaca jelas.
Diagram utuh ada di [bagian 2.4](#24-diagram-utuh).

### 2.1 Kelompok Identitas

```mermaid
erDiagram
    auth_users {
        uuid id PK
        string email UK
        jsonb raw_user_meta_data
        timestamptz created_at
    }

    profiles {
        uuid id PK "FK ke auth_users"
        enum role "student client admin"
        string full_name
        string nickname
        string avatar_url
        text bio
        string phone
        string location
        timestamptz created_at
        timestamptz updated_at
    }

    student_profiles {
        uuid profile_id PK "FK ke profiles"
        string university
        string major
        smallint semester
        string portfolio_url
        string resume_url
        decimal hourly_rate
        timestamptz updated_at
    }

    client_profiles {
        uuid profile_id PK "FK ke profiles"
        string company_name
        enum client_kind "individual company"
        string website
        string industry
        boolean is_verified
        timestamptz updated_at
    }

    auth_users ||--|| profiles : "extends"
    profiles ||--o| student_profiles : "subtype student"
    profiles ||--o| client_profiles : "subtype client"
```

### 2.2 Kelompok Katalog & Lowongan

```mermaid
erDiagram
    client_profiles {
        uuid profile_id PK
        string company_name
    }

    categories {
        uuid id PK
        string name UK
        string slug UK
        text description
        boolean is_active
        timestamptz created_at
    }

    skills {
        uuid id PK
        string name UK
        string slug UK
        timestamptz created_at
    }

    jobs {
        uuid id PK
        uuid client_id FK
        uuid category_id FK
        string title
        text description
        enum payment_type "fixed hourly"
        decimal budget_min
        decimal budget_max
        enum location_type "remote onsite hybrid"
        string location_detail
        date deadline
        enum status "draft open in_progress closed completed cancelled"
        timestamptz published_at
        timestamptz created_at
        timestamptz updated_at
    }

    job_skills {
        uuid job_id PK "FK ke jobs"
        uuid skill_id PK "FK ke skills"
    }

    student_skills {
        uuid student_id PK "FK ke student_profiles"
        uuid skill_id PK "FK ke skills"
        enum level "beginner intermediate advanced expert"
    }

    student_profiles {
        uuid profile_id PK
        string university
    }

    client_profiles ||--o{ jobs : "posts"
    categories ||--o{ jobs : "categorizes"
    jobs ||--o{ job_skills : "requires"
    skills ||--o{ job_skills : "tagged in"
    student_profiles ||--o{ student_skills : "has"
    skills ||--o{ student_skills : "held by"
```

### 2.3 Kelompok Transaksi & Pendukung

```mermaid
erDiagram
    jobs {
        uuid id PK
        string title
        enum status
    }

    student_profiles {
        uuid profile_id PK
        string university
    }

    profiles {
        uuid id PK
        string full_name
    }

    applications {
        uuid id PK
        uuid job_id FK
        uuid student_id FK
        text cover_letter
        decimal proposed_rate
        string attachment_url
        enum status "pending accepted rejected withdrawn"
        timestamptz created_at
        timestamptz updated_at
    }

    contracts {
        uuid id PK
        uuid application_id FK "unique"
        decimal agreed_rate
        enum status "active submitted completed cancelled"
        timestamptz started_at
        timestamptz submitted_at
        timestamptz completed_at
    }

    reviews {
        uuid id PK
        uuid contract_id FK
        uuid reviewer_id FK
        uuid reviewee_id FK
        smallint rating "1 sampai 5"
        text comment
        timestamptz created_at
    }

    saved_jobs {
        uuid student_id PK "FK ke student_profiles"
        uuid job_id PK "FK ke jobs"
        timestamptz created_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        enum type
        string title
        text body
        string link
        boolean is_read
        timestamptz created_at
    }

    jobs ||--o{ applications : "receives"
    student_profiles ||--o{ applications : "submits"
    applications ||--o| contracts : "becomes"
    contracts ||--o{ reviews : "rated via"
    profiles ||--o{ reviews : "writes"
    student_profiles ||--o{ saved_jobs : "bookmarks"
    jobs ||--o{ saved_jobs : "saved as"
    profiles ||--o{ notifications : "receives"
```

### 2.4 Diagram Utuh

Semua tabel dan relasi dalam satu diagram. Kolom sengaja diringkas agar
tetap terbaca. Untuk melihat versi yang bisa di-zoom dan digeser, salin
blok di bawah ke [mermaid.live](https://mermaid.live).

```mermaid
erDiagram
    auth_users {
        uuid id PK
        string email UK
    }

    profiles {
        uuid id PK
        enum role
        string full_name
        string nickname
        string avatar_url
    }

    student_profiles {
        uuid profile_id PK
        string university
        string major
        decimal hourly_rate
    }

    client_profiles {
        uuid profile_id PK
        string company_name
        enum client_kind
        boolean is_verified
    }

    categories {
        uuid id PK
        string name UK
        string slug UK
        boolean is_active
    }

    skills {
        uuid id PK
        string name UK
        string slug UK
    }

    jobs {
        uuid id PK
        uuid client_id FK
        uuid category_id FK
        string title
        enum payment_type
        enum location_type
        enum status
    }

    job_skills {
        uuid job_id PK
        uuid skill_id PK
    }

    student_skills {
        uuid student_id PK
        uuid skill_id PK
        enum level
    }

    applications {
        uuid id PK
        uuid job_id FK
        uuid student_id FK
        decimal proposed_rate
        enum status
    }

    contracts {
        uuid id PK
        uuid application_id FK
        decimal agreed_rate
        enum status
    }

    reviews {
        uuid id PK
        uuid contract_id FK
        uuid reviewer_id FK
        uuid reviewee_id FK
        smallint rating
    }

    saved_jobs {
        uuid student_id PK
        uuid job_id PK
    }

    notifications {
        uuid id PK
        uuid user_id FK
        enum type
        boolean is_read
    }

    auth_users ||--|| profiles : "extends"
    profiles ||--o| student_profiles : "subtype"
    profiles ||--o| client_profiles : "subtype"
    profiles ||--o{ reviews : "writes"
    profiles ||--o{ notifications : "receives"
    client_profiles ||--o{ jobs : "posts"
    categories ||--o{ jobs : "categorizes"
    jobs ||--o{ job_skills : "requires"
    skills ||--o{ job_skills : "tagged in"
    student_profiles ||--o{ student_skills : "has"
    skills ||--o{ student_skills : "held by"
    jobs ||--o{ applications : "receives"
    student_profiles ||--o{ applications : "submits"
    applications ||--o| contracts : "becomes"
    contracts ||--o{ reviews : "rated via"
    student_profiles ||--o{ saved_jobs : "bookmarks"
    jobs ||--o{ saved_jobs : "saved as"
```

> [!NOTE]
> Nama `auth_users` ditulis dengan garis bawah karena Mermaid tidak menerima
> titik pada nama entitas. Nama aslinya `auth.users` — tabel bawaan Supabase
> di skema `auth`, bukan `public`.

> [!NOTE]
> Mermaid hanya mengenal tiga penanda kunci: `PK`, `FK`, dan `UK`. Kolom yang
> berperan ganda (primary key sekaligus foreign key, seperti
> `student_profiles.profile_id`) ditandai `PK` saja, dengan keterangan
> tambahan ditulis sebagai komentar dalam tanda kutip di akhir baris.