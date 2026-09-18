-- ROLES
create type public.app_role as enum ('admin','editor','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- updated_at helper
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "own profile write" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email)
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- LEADS
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  phone text,
  team_size text,
  budget text,
  message text,
  interest text,
  source_page text,
  stage text not null default 'new',
  next_follow_up date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "admins manage leads" on public.leads for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  body text not null,
  author_id uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.lead_notes to authenticated;
grant all on public.lead_notes to service_role;
alter table public.lead_notes enable row level security;
create policy "admins manage lead notes" on public.lead_notes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- CONTENT TABLES
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  problem text,
  deliverables text[] not null default '{}',
  timeline text,
  tools text[] not null default '{}',
  icon text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.industries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  use_cases text[] not null default '{}',
  icon text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client text,
  summary text,
  challenge text,
  approach text,
  outcome text,
  stack text[] not null default '{}',
  metrics jsonb not null default '[]'::jsonb,
  external_url text,
  cover_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  best_for text,
  description text,
  inclusions text[] not null default '{}',
  duration text,
  highlighted boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  cover_url text,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  read_minutes int,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text,
  company text,
  quote text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['services','industries','case_studies','pricing_tiers','posts','testimonials','faqs']
  loop
    execute format('grant select on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public read published %1$s" on public.%1$I for select using (published = true)', t);
    execute format('create policy "admins manage %1$s" on public.%1$I for all to authenticated using (public.has_role(auth.uid(),''admin'')) with check (public.has_role(auth.uid(),''admin''))', t);
    execute format('create trigger %1$s_updated_at before update on public.%1$I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

-- SEED: settings
insert into public.site_settings (key, value) values
 ('hero_eyebrow','AI automation consulting for lean teams'),
 ('hero_headline','Automate the manual work that slows your team down'),
 ('hero_subheadline','RUVABIT designs and builds AI-powered workflows for startups and small enterprises (0-200 people) - cutting handoffs, errors and turnaround time without adding headcount.'),
 ('hero_cta_primary','Book a discovery call'),
 ('hero_cta_secondary','See how it works'),
 ('stat_1_value','15+ yrs'),
 ('stat_1_label','delivery, PMO and business analysis experience'),
 ('stat_2_value','90%'),
 ('stat_2_label','reduction in process variations achieved on delivery programs'),
 ('stat_3_value','20%'),
 ('stat_4_value','6+'),
 ('stat_3_label','uplift in team productivity through workflow optimisation'),
 ('stat_4_label','AI products shipped from zero to launch'),
 ('contact_email','vaibhav.selukar@gmail.com'),
 ('contact_phone','+91 88055 55263'),
 ('contact_location','Nagpur, India - working remote-first with global teams'),
 ('linkedin_url','https://www.linkedin.com/in/vaibhav-selukar'),
 ('producthunt_url','https://www.producthunt.com/@vjvaibhu'),
 ('portfolio_url','https://vaibhavselukar.ruvab.it.com/'),
 ('founder_name','Vaibhav Selukar'),
 ('founder_title','Founder - AI Automation Strategist, Agile PMO & Business Analyst');

-- SEED: services
insert into public.services (slug,title,tagline,problem,deliverables,timeline,tools,icon,sort_order) values
('automation-audit','AI Automation Audit','Find the 5 workflows worth automating first','Teams know work is repetitive but not where the real time and error cost sits.',array['Process inventory across sales, ops, finance and support','Time-and-error cost map per workflow','Prioritised automation backlog with effort vs impact','Executive readout and 90-day roadmap'],'1-2 weeks',array['Process mapping','Jira','Confluence','Zoho Projects'],'search',1),
('workflow-automation','Workflow Automation Build','Ship working automations, not slide decks','Manual copy-paste between tools causes delays, rework and missed follow-ups.',array['End-to-end automated workflows with error handling','Tool and API integrations across your stack','Alerting, logging and human-in-the-loop checkpoints','Documentation and team handover'],'2-6 weeks per workflow',array['n8n','Make','Zapier','Supabase','REST APIs','Webhooks'],'workflow',2),
('ai-agents','AI Agents & Assistants','Put AI where the judgement work happens','Drafting, triaging, summarising and answering repetitive questions eats hours daily.',array['Task-specific AI agents with guardrails','Document, email and ticket triage assistants','Retrieval over your own knowledge base','Prompt libraries and evaluation checks'],'3-6 weeks',array['OpenAI API','Gemini','Claude','Vector search','Prompt engineering'],'bot',3),
('rapid-mvp','Rapid AI MVP Build','Zero-to-one products in weeks, not quarters','Validating an idea takes too long and costs too much with a traditional build cycle.',array['Clickable prototype then production MVP','Auth, database, payments and hosting wired up','Analytics and feedback loops from day one','Launch support including Product Hunt readiness'],'3-8 weeks',array['React','Supabase','Vercel','Stripe','Razorpay','GitHub'],'rocket',4),
('agile-pmo','Agile & PMO Enablement','Governance that speeds delivery up, not down','Delivery is unpredictable, status is unclear and dependencies surface too late.',array['Sprint cadence, backlog and definition-of-done setup','KPI dashboards, velocity and burndown reporting','Risk, dependency and change management framework','Coaching for leads and scrum teams'],'4-8 weeks',array['Scrum','Kanban','Jira','Confluence','Zoho Sprints'],'gauge',5),
('fractional-ai-operator','Fractional AI Operator','An automation partner on retainer','Automation stalls without someone owning it after the first build.',array['Monthly automation roadmap and delivery','Monitoring, fixes and continuous improvement','New workflow builds each cycle','Team enablement and internal AI playbooks'],'Ongoing monthly',array['n8n','Make','OpenAI API','Supabase','Analytics'],'repeat',6);

-- SEED: industries
insert into public.industries (slug,title,summary,use_cases,icon,sort_order) values
('bfsi','BFSI & Fintech','Compliance-heavy processes automated with auditable trails, built on hands-on banking and policy experience.',array['Customer onboarding and KYC document checks','Regulatory policy research and reporting packs','Grievance and redressal workflow tracking','Reconciliation and exception handling'],'landmark',1),
('saas-startups','SaaS & Startups','Lean teams shipping faster with automated delivery, onboarding and support loops.',array['Lead capture to CRM to follow-up automation','Onboarding email and in-app nudge sequences','Support ticket triage and summarisation','Release notes and status reporting'],'rocket',2),
('edtech','EdTech','Admissions, content and learner operations without manual spreadsheets.',array['Applicant screening and interview scheduling','Course content generation and QA support','Learner progress reporting to mentors','Certificate and credential issuance'],'graduation-cap',3),
('wellness-healthtech','Wellness & Healthtech','Client journeys, intake and follow-ups automated with care for sensitive data.',array['Intake forms to structured client records','Session reminders and no-show recovery','Progress summaries for practitioners','Feedback collection and insight rollups'],'heart-pulse',4),
('professional-services','Professional Services','Proposal-to-invoice operations streamlined for consultancies and agencies.',array['Proposal and SoW drafting assistants','Timesheet, utilisation and margin reporting','Client status reports generated automatically','Knowledge base search for delivery teams'],'briefcase',5);

-- SEED: case studies
insert into public.case_studies (slug,title,client,summary,challenge,approach,outcome,stack,metrics,external_url,featured,sort_order) values
('langscribe','LangScribe - multilingual transcription & OCR','Internal product','An AI platform that turns audio and image-based text into structured, searchable output across languages.','Teams handling multilingual audio and scanned documents were transcribing and re-typing content by hand, creating delays and errors.','Designed an AI pipeline combining speech-to-text, OCR and language detection, with a review step for low-confidence segments.','Launched publicly on Product Hunt and used as a reference architecture for document-heavy automation engagements.',array['OpenAI API','React','Supabase','Vercel'],'[{"label":"Manual retyping removed","value":"~90%"},{"label":"Languages supported","value":"Multi"}]'::jsonb,'https://www.producthunt.com/@vjvaibhu',true,1),
('fyppal','FYPPAL - AI productivity workflow assistant','Internal product','An AI-assisted productivity and workflow management tool focused on operational efficiency.','Individual contributors lost time switching between task lists, notes and follow-ups with no single view of priorities.','Built an assistant that consolidates tasks, suggests next actions and automates recurring workflow steps.','Shipped as a live product with a personalised engagement loop and repeatable automation patterns.',array['React','Supabase','OpenAI API'],'[{"label":"Tools consolidated","value":"3 to 1"}]'::jsonb,'https://www.producthunt.com/@vjvaibhu',true,2),
('trendsolver','TrendSolver - AI trend and insight engine','Internal product','A trend analysis application that turns scattered signals into usable insight through AI pipelines.','Manual research across sources took hours and produced inconsistent, quickly outdated summaries.','Automated collection, clustering and summarisation of trend data with scheduled refresh jobs.','Insight cycles moved from manual research sessions to automated, repeatable reports.',array['AI pipelines','Automation schedulers','React'],'[{"label":"Research time","value":"Hours to minutes"}]'::jsonb,'https://www.producthunt.com/@vjvaibhu',true,3),
('doneche','Doneche - job application tracker & personal CRM','Live product','A minimalist tracking platform that helps job seekers run their hiring pipeline like a CRM.','Applicants lost track of roles, statuses and follow-ups spread across portals and inboxes.','Built a Kanban pipeline with automated follow-up prompts and a lightweight personal CRM model.','Live MVP built by a job seeker for job seekers, validating the same pipeline pattern used in client CRM builds.',array['React','Supabase','Automation workflows'],'[{"label":"Pipeline stages tracked","value":"End to end"}]'::jsonb,'https://doneche.shabdly.online',false,4),
('heybud','HeyBud - peer mentorship platform','Live product','A progressive web app offering a supportive space for peer mentorship and listening.','People needed an accessible, low-friction way to connect with peers and share guidance.','Designed a PWA with matching, conversation flows and safety-aware moderation prompts.','Live product demonstrating community workflows and AI-assisted moderation patterns.',array['PWA','React','Supabase'],'[{"label":"Delivery","value":"Zero to live"}]'::jsonb,'https://heybud.shabdly.online',false,5),
('qr-generator-pro','QR Generator Pro - utility automation platform','Internal product','An advanced QR generation platform with deep customisation and utility automation.','Marketing and ops teams needed batches of customised, trackable codes without a manual design step.','Automated generation, branding and export flows with a self-serve interface.','Shipped as a public utility product and reused as a template for internal tooling builds.',array['React','Vercel','Automation'],'[{"label":"Batch generation","value":"Automated"}]'::jsonb,'https://www.producthunt.com/@vjvaibhu',false,6);

-- SEED: pricing tiers
insert into public.pricing_tiers (slug,name,best_for,description,inclusions,duration,highlighted,sort_order) values
('audit-sprint','Audit Sprint','Teams who suspect waste but need proof','A focused diagnostic that maps where manual effort, errors and delays actually cost you, and what to automate first.',array['Stakeholder interviews and process walkthroughs','Time-and-error cost map','Prioritised automation backlog','90-day roadmap and executive readout'],'1-2 weeks',false,1),
('automation-build','Automation Build','Teams ready to ship their first automations','Design and delivery of production automations and AI agents for your highest-impact workflows.',array['Everything in Audit Sprint','2-4 production workflows or AI agents','Integrations across your existing tools','Monitoring, error handling and documentation','Team training and handover'],'4-8 weeks',true,2),
('ongoing-partner','Ongoing Partner','Teams who want automation to keep compounding','A fractional AI operator embedded with your team, shipping and maintaining automation every month.',array['Everything in Automation Build','Monthly roadmap and new builds','Proactive monitoring and improvements','Agile/PMO reporting and dashboards','Priority support and async availability'],'Monthly retainer',false,3);

-- SEED: testimonials
insert into public.testimonials (author,role,company,quote,sort_order) values
('Delivery Leadership','Program Sponsor','Enterprise SaaS engagement','Process variations dropped dramatically once consistent delivery standards were introduced across our accounts.',1),
('PMO Manager','PMO','IT services engagement','Reporting went from chased spreadsheets to dashboards leadership actually trusted.',2),
('Product Owner','Product','CRM implementation','Sprint execution and stakeholder communication became predictable, which is exactly what we needed.',3);

-- SEED: faqs
insert into public.faqs (question,answer,sort_order) values
('How quickly can we see results?','Most engagements start with a 1-2 week audit, and the first working automation is typically live within 2-4 weeks of the build starting.',1),
('Do we need an in-house AI team?','No. RUVABIT works as your automation partner, builds inside your existing tools and hands over documented workflows your team can run.',2),
('What size companies do you work with?','Teams from solo founders up to around 200 employees - startups, new companies and lean B2B enterprises.',3),
('Which tools do you automate with?','Commonly n8n, Make, Zapier, OpenAI, Gemini and Claude APIs, Supabase, Jira, Confluence, Zoho, plus direct API and webhook integrations.',4),
('How is pricing structured?','Engagements are scoped as an Audit Sprint, an Automation Build or an ongoing partnership. Pricing is shared after a short discovery call so it reflects real scope.',5),
('Is our data safe?','Automations run in your own accounts wherever possible, with least-privilege access, audit trails and no unnecessary data retention.',6);

-- SEED: one blog post
insert into public.posts (slug,title,excerpt,body,tags,seo_title,seo_description,read_minutes,published,published_at) values
('where-to-start-with-ai-automation','Where small teams should start with AI automation','A practical order of operations for teams under 200 people: find the cost, automate the handoff, then add AI judgement.','Most automation projects fail for an unglamorous reason: the team automates the workflow that is easiest to see rather than the one that costs the most.

## 1. Measure the cost, not the annoyance

Start by listing every recurring task, then attach two numbers to each: minutes per run and error rate. The workflow with the highest minutes-times-frequency plus rework cost is your first candidate, even if it feels mundane.

## 2. Automate handoffs before tasks

In small teams, delay rarely comes from typing. It comes from waiting: waiting for approval, for a file, for someone to notice a form was submitted. Automating the handoff - routing, notifying, creating the record - usually delivers more turnaround-time improvement than automating the task itself.

## 3. Add AI where judgement is repetitive

Once the plumbing is reliable, AI earns its place in the steps that need reading, summarising, drafting or classifying. Keep a human checkpoint on anything that touches money, compliance or customers.

## 4. Instrument everything

Every automation should log what it did, alert when it fails and expose a simple success metric. Automation you cannot observe is a liability.

## 5. Hand it over

The engagement is not finished when the workflow runs. It is finished when your team can explain it, change it and monitor it without external help.',array['Automation','Strategy','AI'],'Where small teams should start with AI automation | RUVABIT','A practical order of operations for AI automation in teams under 200 people: measure cost, automate handoffs, then add AI judgement.',5,true,now());