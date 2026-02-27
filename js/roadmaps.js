'use strict';
/* ════════════════════════════════════════════
   VERDANT — roadmaps.js
   Visual flow diagram, localStorage progress,
   sidebar nav, search, 12 roadmaps
   ════════════════════════════════════════════ */

/* ═══════════ DATA ═══════════ */
const RM = [

// ───────────── FRONTEND ─────────────
{ id:'frontend', icon:'🌐', title:'Frontend Developer', type:'role', diff:'Beginner', dur:'4–6 mo',
  desc:'From HTML basics to React apps — everything to build modern, responsive UIs.',
  about:'The Frontend roadmap covers the full journey from raw HTML and CSS to JavaScript frameworks, testing, and deployment. You\'ll learn how browsers work, build accessible and responsive layouts, and ship production React apps.\n\nIdeal for beginners entering web dev or developers solidifying fundamentals.',
  prereqs:['Basic computer skills','Comfort with a text editor','No prior coding needed'],
  tags:['HTML','CSS','JavaScript','React','TypeScript','Next.js','Testing'],
  phases:[
    { label:'Internet Fundamentals', nodes:[
      { name:'How the Web Works', tag:'core', desc:'HTTP/S, DNS, browsers, TCP/IP, clients vs servers.', subs:['HTTP request/response cycle','What DNS does','How browsers render','TCP vs UDP'] },
      { name:'CLI & Terminal', tag:'core', desc:'Navigate the file system, run scripts.', subs:['cd, ls, mkdir, rm','Running npm scripts','Environment variables','SSH basics'] },
    ]},
    { label:'HTML', nodes:[
      { name:'HTML Basics', tag:'core', desc:'Document structure, tags, attributes, nesting.', subs:['Doctype, head, body','Headings, paragraphs, links','Lists, tables, images'] },
      { name:'Semantic HTML', tag:'core', desc:'Meaningful markup for accessibility and SEO.', subs:['article, section, nav, aside','header, footer, main','figure, time, address'] },
      { name:'Forms & Validation', tag:'core', desc:'Input types, labels, HTML5 constraints.', subs:['input types (email, date, range)','required, pattern, min/max','Fieldset & legend'] },
      { name:'Web Accessibility', tag:'core', desc:'ARIA, keyboard nav, WCAG 2.1 basics.', subs:['alt text & ARIA labels','Focus management','Colour contrast','Screen reader testing'] },
    ]},
    { label:'CSS', nodes:[
      { name:'CSS Fundamentals', tag:'core', desc:'Selectors, box model, cascade, specificity.', subs:['Class, ID, pseudo selectors','Margin, padding, border','Specificity rules','Inheritance & cascade'] },
      { name:'Flexbox', tag:'core', desc:'One-dimensional, row/column layouts.', subs:['flex-direction, justify-content','align-items, flex-wrap','flex-grow / shrink / basis'] },
      { name:'CSS Grid', tag:'core', desc:'Two-dimensional layouts.', subs:['grid-template-columns/rows','grid-area, span','auto-fill / minmax','Named grid lines'] },
      { name:'Responsive Design', tag:'core', desc:'Media queries, mobile-first, fluid type.', subs:['@media breakpoints','Viewport meta tag','clamp(), min(), max()','Container queries'] },
      { name:'CSS Custom Properties', tag:'core', desc:'Variables and theming.', subs:['--var declaration','var() usage','Dark mode toggle','Theme tokens'] },
      { name:'Animations & Transitions', tag:'optional', desc:'@keyframes, transitions, transforms.', subs:['transition shorthand','@keyframes animation','transform properties','will-change hints'] },
      { name:'Tailwind CSS', tag:'alt', desc:'Utility-first rapid UI building.', subs:['Core utility classes','Responsive prefixes','Dark mode variant','@apply directive'] },
    ]},
    { label:'JavaScript', nodes:[
      { name:'JS Fundamentals', tag:'core', desc:'Variables, types, operators, control flow.', subs:['let, const, var','Type coercion','if/else, switch, ternary','for, while, for…of'] },
      { name:'Functions & Scope', tag:'core', desc:'Closures, hoisting, arrow functions.', subs:['Arrow vs regular','Closures & lexical scope','Hoisting behaviour','Default & rest params'] },
      { name:'DOM Manipulation', tag:'core', desc:'Select, modify, create elements.', subs:['querySelector / getElementById','createElement, appendChild','classList toggle/add/remove','innerHTML vs textContent'] },
      { name:'Events', tag:'core', desc:'Listeners, bubbling, delegation.', subs:['addEventListener','Event object & preventDefault','Bubbling & capturing','Event delegation pattern'] },
      { name:'Async JavaScript', tag:'core', desc:'Promises, async/await, fetch API.', subs:['Callback functions','Promise .then/.catch/.finally','async / await','fetch & error handling'] },
      { name:'ES6+ Features', tag:'core', desc:'Modern syntax every JS dev must know.', subs:['Destructuring','Spread & rest operators','Template literals','Optional chaining ?.','Nullish coalescing ??'] },
      { name:'Modules (ESM)', tag:'core', desc:'import / export, dynamic imports.', subs:['Named vs default exports','Dynamic import()','Module bundlers overview'] },
    ]},
    { label:'Version Control', nodes:[
      { name:'Git Basics', tag:'core', desc:'Commits, branches, merging.', subs:['git init, add, commit','git branch, checkout, merge','Merge conflicts','.gitignore'] },
      { name:'GitHub Workflow', tag:'core', desc:'Remote repos, pull requests, code review.', subs:['push, pull, fetch','Fork & PR workflow','Code review etiquette','GitHub Actions intro'] },
    ]},
    { label:'Tooling', nodes:[
      { name:'Package Managers', tag:'core', desc:'npm / yarn / pnpm — install, scripts, semver.', subs:['npm install, run, audit','package.json & lockfiles','Semantic versioning','Monorepo basics'] },
      { name:'Module Bundlers', tag:'core', desc:'Vite / Webpack — how bundling works.', subs:['What bundlers do','Vite dev server & HMR','Code splitting','Tree shaking'] },
      { name:'TypeScript', tag:'optional', desc:'Static types for safer, scalable JS.', subs:['Type annotations & inference','Interfaces & type aliases','Generics','tsconfig.json','TS with React'] },
    ]},
    { label:'Frameworks', nodes:[
      { name:'React.js', tag:'core', desc:'Most popular UI library — components, hooks, state.', subs:['JSX syntax','Functional components','useState, useEffect','useContext, useRef','Custom hooks','React DevTools'] },
      { name:'Vue.js', tag:'alt', desc:'Progressive framework with gentle learning curve.', subs:['Options vs Composition API','v-bind, v-on, v-if, v-for','Pinia state management','Vue Router'] },
      { name:'Next.js', tag:'optional', desc:'React meta-framework with SSR, SSG, API routes.', subs:['App Router vs Pages Router','Server & Client components','Server Actions','Image & Font optimisation'] },
      { name:'State Management', tag:'core', desc:'Zustand, Redux Toolkit, React Query.', subs:['When to use global state','Zustand stores','Redux Toolkit slice','React Query for server state'] },
    ]},
    { label:'Testing & Deployment', nodes:[
      { name:'Unit Testing', tag:'core', desc:'Vitest / Jest for testing functions.', subs:['describe, it, expect','Mocking modules','Code coverage'] },
      { name:'Component Testing', tag:'core', desc:'React Testing Library.', subs:['render, screen, fireEvent','getByRole / getByText','user-event library'] },
      { name:'Web Performance', tag:'core', desc:'Core Web Vitals, LCP, CLS, optimisation.', subs:['Lighthouse audit','Image optimisation','Lazy loading','Caching strategies'] },
      { name:'Deployment', tag:'core', desc:'Vercel, Netlify, GitHub Pages.', subs:['Static vs dynamic hosting','Env variables','Preview deploys','Custom domains & SSL'] },
    ]},
  ],
  resources:[
    { type:'article', title:'MDN Web Docs', sub:'Mozilla · Definitive web reference', icon:'📄' },
    { type:'course',  title:'The Odin Project', sub:'Free full-stack curriculum', icon:'🎓' },
    { type:'course',  title:'Frontend Masters', sub:'Premium industry-expert courses', icon:'🎓' },
    { type:'video',   title:'Traversy Media – YouTube', sub:'Practical web dev crash courses', icon:'🎬' },
    { type:'docs',    title:'React Documentation', sub:'react.dev — hooks, patterns', icon:'📘' },
    { type:'book',    title:"You Don't Know JS", sub:'Kyle Simpson · Free on GitHub', icon:'📚' },
  ]
},

// ───────────── BACKEND ─────────────
{ id:'backend', icon:'⚙️', title:'Backend Developer', type:'role', diff:'Intermediate', dur:'5–8 mo',
  desc:'APIs, databases, auth, and scalable server-side systems.',
  about:'Build production-grade REST APIs, design relational databases, implement auth flows, and deploy containerised services. Covers Node.js, PostgreSQL, Redis, Docker, and CI/CD.\n\nSuited for developers who know a scripting language and want to specialise in server logic and data.',
  prereqs:['Basic programming in any language','Familiarity with terminal','HTTP basics'],
  tags:['Node.js','Express','PostgreSQL','Redis','Docker','Auth','REST','GraphQL'],
  phases:[
    { label:'Choose a Language', nodes:[
      { name:'Node.js', tag:'core', desc:'JS runtime — event loop, non-blocking I/O, npm.', subs:['Event loop mechanics','CommonJS vs ESM','Built-in modules (fs, path, http)','npm ecosystem'] },
      { name:'Python (FastAPI / Django)', tag:'alt', desc:'Readable, ecosystem-rich language.', subs:['FastAPI async endpoints','Django ORM','pip & virtualenv','Type hints'] },
      { name:'Go', tag:'alt', desc:'High-performance compiled language.', subs:['Goroutines & channels','net/http stdlib','Go modules','Struct patterns'] },
    ]},
    { label:'HTTP & API Design', nodes:[
      { name:'HTTP Deep Dive', tag:'core', desc:'Methods, headers, status codes, caching.', subs:['GET/POST/PUT/PATCH/DELETE','Content-Type & Accept','Status codes (2xx/4xx/5xx)','Cache-Control headers'] },
      { name:'REST API Design', tag:'core', desc:'Resource naming, versioning, best practices.', subs:['Resource naming conventions','API versioning (/v1/)','Pagination & filtering','HATEOAS overview'] },
      { name:'Express.js / Fastify', tag:'core', desc:'Node.js web framework.', subs:['Routing & middleware','Request/response object','Error-handling middleware','Request validation (Zod)'] },
      { name:'GraphQL', tag:'alt', desc:'Schema-first flexible query API.', subs:['Schema & type system','Queries, mutations, subscriptions','Resolvers','Apollo Server / Yoga'] },
      { name:'WebSockets & SSE', tag:'optional', desc:'Real-time bidirectional communication.', subs:['WebSocket handshake','Socket.IO rooms','Server-Sent Events','When to choose each'] },
    ]},
    { label:'Databases', nodes:[
      { name:'SQL — PostgreSQL', tag:'core', desc:'Relational DB — joins, indexes, transactions.', subs:['CREATE / INSERT / SELECT / UPDATE / DELETE','INNER, LEFT, RIGHT JOINs','Indexes & EXPLAIN ANALYZE','ACID transactions','Foreign keys & constraints'] },
      { name:'ORM — Prisma / Drizzle', tag:'core', desc:'Type-safe database access layer.', subs:['Schema definition & migrations','CRUD with ORM','Relations: 1-many, many-many','Raw SQL when needed'] },
      { name:'NoSQL — MongoDB', tag:'optional', desc:'Document store for flexible schemas.', subs:['Collections & documents','Aggregation pipeline','Atlas Search','Change streams'] },
      { name:'Redis', tag:'optional', desc:'In-memory store for caching, sessions, queues.', subs:['Key-value operations','TTL & expiry','Pub/Sub','BullMQ job queues'] },
      { name:'Database Design', tag:'core', desc:'Normalisation, ERDs, schema patterns.', subs:['1NF / 2NF / 3NF','Entity-relationship diagrams','Soft deletes & audit logs','Multi-tenancy patterns'] },
    ]},
    { label:'Auth & Security', nodes:[
      { name:'Auth Fundamentals', tag:'core', desc:'Sessions, cookies, JWT — how auth works.', subs:['Cookie-based sessions','JWT structure & signing','Refresh token rotation','Secure cookie flags'] },
      { name:'OAuth 2.0 & OIDC', tag:'core', desc:'Social login & third-party auth flows.', subs:['Authorization code + PKCE','Social providers (Google, GitHub)','Auth0 / Clerk / Supabase Auth','ID tokens vs access tokens'] },
      { name:'Password Security', tag:'core', desc:'Hashing, salting, secure storage.', subs:['bcrypt / argon2','Never plaintext','Login rate limiting','MFA / TOTP'] },
      { name:'API Security (OWASP)', tag:'core', desc:'Injection, XSS, CSRF, CORS, rate limiting.', subs:['SQL injection prevention','XSS & CSRF protection','CORS configuration','Helmet.js security headers','Rate limiting & throttling'] },
    ]},
    { label:'Architecture', nodes:[
      { name:'MVC & Layered Architecture', tag:'core', desc:'Controllers, services, repositories.', subs:['Controller → Service → Repository','Separation of concerns','Dependency injection','DTO validation'] },
      { name:'Background Jobs & Queues', tag:'optional', desc:'Async processing with job queues.', subs:['BullMQ with Redis','Cron-scheduled jobs','Retry & dead-letter queues'] },
      { name:'Microservices', tag:'optional', desc:'Service decomposition & messaging.', subs:['Monolith vs microservices tradeoffs','REST vs Kafka / RabbitMQ','Service discovery','API gateway pattern'] },
    ]},
    { label:'Testing & Deployment', nodes:[
      { name:'API Testing', tag:'core', desc:'Jest/Vitest + Supertest for route testing.', subs:['Testing service logic','Supertest HTTP assertions','DB test setup/teardown','Mocking dependencies'] },
      { name:'Docker', tag:'core', desc:'Containerise your app.', subs:['Dockerfile basics','docker-compose for local dev','Multi-stage builds','Container registries'] },
      { name:'CI/CD — GitHub Actions', tag:'core', desc:'Automated test + deploy pipelines.', subs:['Workflow YAML syntax','Run tests on PR','Deploy to Railway / Render','Secrets management'] },
      { name:'Logging & Monitoring', tag:'core', desc:'Structured logs, error tracking, health checks.', subs:['Pino / Winston logging','Log levels & structured JSON','Sentry for errors','Health check endpoints'] },
    ]},
  ],
  resources:[
    { type:'course',  title:'Node.js — The Complete Guide', sub:'Udemy · Maximilian Schwarzmüller', icon:'🎓' },
    { type:'docs',    title:'PostgreSQL Documentation', sub:'postgresql.org · Full SQL reference', icon:'📘' },
    { type:'video',   title:'Fireship — YouTube', sub:'Dense backend & full-stack videos', icon:'🎬' },
    { type:'docs',    title:'Prisma Docs', sub:'prisma.io · Modern ORM for Node/TS', icon:'📘' },
    { type:'book',    title:'Designing Data-Intensive Applications', sub:'Kleppmann — architecture bible', icon:'📚' },
  ]
},

// ───────────── DEVOPS ─────────────
{ id:'devops', icon:'🚀', title:'DevOps Engineer', type:'role', diff:'Advanced', dur:'6–10 mo',
  desc:'Containers, CI/CD, cloud infra, monitoring, and SRE practices.',
  about:'DevOps bridges development and operations. You\'ll master Docker, Kubernetes, Terraform, GitHub Actions, AWS, and observability tooling.\n\nBest for backend developers who want to specialise in infrastructure and deployment automation.',
  prereqs:['Comfortable with Linux & terminal','Basic networking knowledge','Experience with one backend language'],
  tags:['Linux','Docker','Kubernetes','Terraform','AWS','GitHub Actions','Prometheus'],
  phases:[
    { label:'Linux & Networking', nodes:[
      { name:'Linux Fundamentals', tag:'core', desc:'Filesystem, processes, permissions, shell.', subs:['Filesystem hierarchy (/etc, /var)','chmod, chown, users & groups','ps, kill, htop, systemd','Cron jobs'] },
      { name:'Bash Scripting', tag:'core', desc:'Automate tasks with shell scripts.', subs:['Variables, loops, conditionals','Functions & arguments','Exit codes & error handling','Heredoc & pipes'] },
      { name:'Networking Basics', tag:'core', desc:'TCP/IP, DNS, HTTP, firewalls, load balancers.', subs:['OSI model','IP & subnets','DNS resolution','TCP vs UDP','UFW & iptables basics'] },
      { name:'SSH & Server Hardening', tag:'core', desc:'Keys, tunnels, securing Linux servers.', subs:['SSH key generation','Port forwarding','Fail2ban & UFW','Hardening checklist'] },
    ]},
    { label:'Containers', nodes:[
      { name:'Docker', tag:'core', desc:'Build, ship, run containerised applications.', subs:['Dockerfile instructions','Images vs containers','Volumes & bind mounts','docker-compose.yml','Multi-stage builds','Container registries'] },
      { name:'Container Networking', tag:'core', desc:'Bridge, host, overlay networks.', subs:['Bridge network (default)','Port binding (-p)','Docker DNS','Network isolation'] },
      { name:'Kubernetes (K8s)', tag:'core', desc:'Container orchestration at scale.', subs:['Pods, Deployments, StatefulSets','Services (ClusterIP/NodePort/LB)','ConfigMaps & Secrets','Ingress controllers','Persistent Volumes','Helm charts','kubectl mastery'] },
      { name:'Service Mesh', tag:'optional', desc:'Istio / Linkerd for service-to-service comms.', subs:['Sidecar proxy pattern','mTLS between services','Traffic management & canary','Observability via mesh'] },
    ]},
    { label:'CI/CD', nodes:[
      { name:'GitHub Actions', tag:'core', desc:'Automate build, test, and deploy.', subs:['Workflow YAML syntax','Jobs, steps, runners','Secrets & env vars','Matrix builds','Reusable workflows'] },
      { name:'GitLab CI / Jenkins', tag:'alt', desc:'Enterprise CI/CD alternatives.', subs:['.gitlab-ci.yml pipelines','Jenkins Groovy DSL','Artifact management'] },
      { name:'GitOps — ArgoCD', tag:'optional', desc:'Declarative cluster state from Git.', subs:['GitOps principles','ArgoCD app definitions','Sync policies & rollbacks'] },
    ]},
    { label:'Cloud & IaC', nodes:[
      { name:'AWS Core Services', tag:'core', desc:'EC2, S3, IAM, VPC, RDS — the essentials.', subs:['IAM users, roles, policies','EC2 instances & AMIs','S3 buckets & lifecycle','VPC, subnets, security groups','RDS & Aurora','Lambda','CloudFront CDN'] },
      { name:'Terraform', tag:'core', desc:'Infrastructure as Code (HCL).', subs:['HCL resources, variables, outputs','State (local vs remote)','Modules & reusability','plan / apply / destroy','Drift detection'] },
      { name:'Ansible', tag:'optional', desc:'Config management & provisioning.', subs:['Playbooks & roles','Inventory files','Idempotent tasks','Ansible Vault'] },
    ]},
    { label:'Observability', nodes:[
      { name:'Logging — ELK / Loki', tag:'core', desc:'Centralise, search, alert on logs.', subs:['Structured JSON logs','Fluentd / Vector shipping','Elasticsearch / Loki storage','Kibana / Grafana dashboards'] },
      { name:'Metrics — Prometheus + Grafana', tag:'core', desc:'Scrape and visualise system metrics.', subs:['Prometheus exporters','PromQL queries','AlertManager rules','Grafana dashboards'] },
      { name:'Distributed Tracing', tag:'optional', desc:'Jaeger / Tempo for microservice traces.', subs:['OpenTelemetry SDK','Trace sampling','Span attributes','Correlating logs, metrics, traces'] },
      { name:'SRE Practices', tag:'core', desc:'SLIs, SLOs, error budgets, on-call.', subs:['Service Level Indicators','Error budgets & SLOs','Runbooks & postmortems','Incident management'] },
    ]},
  ],
  resources:[
    { type:'course',  title:'KodeKloud DevOps Path', sub:'Hands-on labs & certifications', icon:'🎓' },
    { type:'docs',    title:'Kubernetes Documentation', sub:'kubernetes.io · Official reference', icon:'📘' },
    { type:'video',   title:'TechWorld with Nana', sub:'YouTube · DevOps for beginners', icon:'🎬' },
    { type:'course',  title:'AWS SAA-C03', sub:'A Cloud Guru / Adrian Cantrill', icon:'🎓' },
    { type:'book',    title:'The DevOps Handbook', sub:'Kim, Humble, Debois, Willis', icon:'📚' },
  ]
},

// ───────────── FULLSTACK ─────────────
{ id:'fullstack', icon:'⚡', title:'Full Stack Developer', type:'role', diff:'Intermediate', dur:'8–12 mo',
  desc:'Build complete web apps — from pixel-perfect UIs to production APIs and databases.',
  about:'Full Stack combines frontend and backend into one cohesive path. Build with React + TypeScript on the frontend, Node.js + PostgreSQL on the backend, then stitch it together with Next.js and deploy.\n\nIdeal for developers who want to own entire features end-to-end.',
  prereqs:['Basic HTML/CSS/JS','Comfortable with terminal','Familiarity with one programming concept'],
  tags:['React','TypeScript','Node.js','PostgreSQL','Next.js','Docker','Prisma'],
  phases:[
    { label:'Frontend Foundation', nodes:[
      { name:'HTML + CSS + Vanilla JS', tag:'core', desc:'Solid base before any framework.', subs:['Semantic HTML5','CSS Grid & Flexbox','ES6+ JavaScript','DOM manipulation'] },
      { name:'React + TypeScript', tag:'core', desc:'Component-based UI with type safety.', subs:['JSX & functional components','Hooks: useState, useEffect, useRef','React Router v6','TS generics & utility types'] },
      { name:'Tailwind + UI Libraries', tag:'optional', desc:'Fast, consistent UI building.', subs:['Tailwind utility classes','shadcn/ui components','Framer Motion animations','Radix UI primitives'] },
    ]},
    { label:'Backend Foundation', nodes:[
      { name:'Node.js + Express / Fastify', tag:'core', desc:'REST APIs with Node.js.', subs:['Routing & middleware','Zod validation','File uploads','Error handling'] },
      { name:'PostgreSQL + Prisma', tag:'core', desc:'Relational data modelling with type-safe ORM.', subs:['Schema design','Migrations','One-to-many, many-to-many','Seeding & fixtures'] },
      { name:'JWT Auth + OAuth', tag:'core', desc:'Secure auth from scratch.', subs:['JWT creation & verification','Refresh tokens','Google / GitHub OAuth','Protected routes & middleware'] },
    ]},
    { label:'Full Stack Integration', nodes:[
      { name:'Next.js App Router', tag:'core', desc:'Full-stack React framework.', subs:['Server & Client components','Server Actions','Metadata & SEO','next/image & next/font'] },
      { name:'tRPC + React Query', tag:'optional', desc:'End-to-end typesafe API layer.', subs:['tRPC routers & procedures','React Query mutations','Optimistic updates','Infinite queries'] },
      { name:'Real-time (WebSockets)', tag:'optional', desc:'Live updates with Socket.IO.', subs:['WebSocket server setup','Socket.IO rooms','Presence & typing indicators','SSE as lighter alternative'] },
    ]},
    { label:'Deploy & Scale', nodes:[
      { name:'Docker + CI/CD', tag:'core', desc:'Containerise and automate.', subs:['Multi-stage Dockerfile','docker-compose for dev','GitHub Actions pipeline'] },
      { name:'Cloud Deployment', tag:'core', desc:'Vercel / Railway / Render / AWS.', subs:['Env variable management','DB hosting (Neon, Supabase, Railway)','Domain & SSL setup','Preview deployments'] },
    ]},
  ],
  resources:[
    { type:'course',  title:'Full Stack Open', sub:'Univ. of Helsinki · Free & comprehensive', icon:'🎓' },
    { type:'video',   title:'Theo (t3.gg) — YouTube', sub:'T3 stack: Next.js, TypeScript, tRPC', icon:'🎬' },
    { type:'docs',    title:'Next.js Documentation', sub:'nextjs.org · App Router reference', icon:'📘' },
  ]
},

// ───────────── AI/ML ─────────────
{ id:'ai-ml', icon:'🤖', title:'AI / ML Engineer', type:'role', diff:'Advanced', dur:'8–14 mo',
  desc:'Linear regression to LLMs, RAG pipelines, and production ML systems.',
  about:'The deepest technical roadmap here. You\'ll build a mathematical foundation, learn classical ML, then deep learning and modern LLM tooling including fine-tuning and RAG.\n\nSuited for Python-comfortable developers ready to specialise in AI.',
  prereqs:['Python proficiency','Basic calculus & linear algebra','Statistics fundamentals'],
  tags:['Python','PyTorch','Scikit-learn','LLMs','RAG','MLOps','Transformers'],
  phases:[
    { label:'Mathematics', nodes:[
      { name:'Linear Algebra', tag:'core', desc:'Vectors, matrices — the backbone of ML.', subs:['Vectors & dot products','Matrix multiplication','Eigenvalues & eigenvectors','SVD decomposition'] },
      { name:'Calculus & Optimisation', tag:'core', desc:'Derivatives, gradients, gradient descent.', subs:['Derivatives & chain rule','Partial derivatives','Gradient descent variants','Learning rate schedules'] },
      { name:'Statistics & Probability', tag:'core', desc:'Distributions, Bayes, hypothesis testing.', subs:['Probability distributions','Bayes theorem','CLT','Hypothesis testing & p-values'] },
    ]},
    { label:'Python for Data Science', nodes:[
      { name:'NumPy', tag:'core', desc:'N-dimensional arrays & vectorised ops.', subs:['ndarray creation & indexing','Broadcasting','Linear algebra ops','Random number generation'] },
      { name:'Pandas', tag:'core', desc:'Data manipulation & analysis.', subs:['DataFrame & Series','Data cleaning','GroupBy & aggregation','Merge & join'] },
      { name:'Matplotlib & Seaborn', tag:'core', desc:'Visualise data & model results.', subs:['Line, scatter, bar, hist','Heatmaps & pairplots','Subplots & figure customisation'] },
    ]},
    { label:'Classical ML', nodes:[
      { name:'Scikit-learn', tag:'core', desc:'Industry-standard ML library.', subs:['Train/test split','Cross-validation','Pipeline API','Evaluation metrics (F1, AUC)'] },
      { name:'Supervised Learning', tag:'core', desc:'Regression & classification.', subs:['Linear & logistic regression','Decision trees & random forests','SVMs','XGBoost / LightGBM'] },
      { name:'Unsupervised Learning', tag:'optional', desc:'Clustering & dimensionality reduction.', subs:['K-Means & DBSCAN','PCA & t-SNE','Autoencoders','Anomaly detection'] },
      { name:'Feature Engineering', tag:'core', desc:'Transform raw data into model inputs.', subs:['Imputation strategies','Encoding categoricals','Scaling & normalisation','Feature selection'] },
    ]},
    { label:'Deep Learning', nodes:[
      { name:'Neural Networks', tag:'core', desc:'Perceptrons, backprop, activations.', subs:['MLP architecture','Forward pass','Backpropagation','Activation functions (ReLU, GELU)','Loss functions'] },
      { name:'PyTorch', tag:'core', desc:'Leading deep learning framework.', subs:['Tensors & autograd','nn.Module & layers','Training loops','DataLoader & Datasets','CUDA / GPU training'] },
      { name:'Computer Vision (CNNs)', tag:'optional', desc:'Image models with PyTorch.', subs:['Conv layers, pooling, strides','ResNet / EfficientNet','Transfer learning','YOLO object detection'] },
    ]},
    { label:'LLMs & Generative AI', nodes:[
      { name:'Transformer Architecture', tag:'core', desc:'Self-attention, BERT, GPT internals.', subs:['Self-attention mechanism','Multi-head attention','Positional encoding','Encoder vs decoder'] },
      { name:'Fine-tuning LLMs', tag:'core', desc:'Adapt pre-trained models to new tasks.', subs:['Full fine-tuning vs PEFT','LoRA & QLoRA','Instruction tuning','Evaluation benchmarks'] },
      { name:'RAG Pipelines', tag:'core', desc:'Retrieval-Augmented Generation.', subs:['Embedding models','Vector DBs (Pinecone, pgvector)','Chunking strategies','Re-ranking & hybrid search'] },
      { name:'Prompt Engineering', tag:'core', desc:'Get better outputs from LLMs.', subs:['Zero/few-shot prompting','Chain-of-thought (CoT)','ReAct agents','Structured output (JSON mode)'] },
      { name:'LangChain / LlamaIndex', tag:'optional', desc:'LLM application frameworks.', subs:['Chains & pipelines','Agents & tools','Memory patterns','Document loaders'] },
    ]},
    { label:'MLOps', nodes:[
      { name:'Experiment Tracking — MLflow', tag:'core', desc:'Track runs, params, metrics, models.', subs:['Tracking server','Logging params & metrics','Model registry','Artifact storage'] },
      { name:'Model Serving', tag:'core', desc:'FastAPI or BentoML inference endpoints.', subs:['FastAPI prediction route','Model versioning','Batch vs online inference','GPU serving'] },
      { name:'Data Versioning — DVC', tag:'optional', desc:'Version datasets like code.', subs:['dvc init & remote','DVC pipelines','Dataset versioning workflow'] },
      { name:'Model Monitoring', tag:'core', desc:'Data drift, decay, alerting.', subs:['Data drift detection (Evidently)','A/B testing models','Retraining triggers'] },
    ]},
  ],
  resources:[
    { type:'course',  title:'fast.ai Practical Deep Learning', sub:'free · top-down approach', icon:'🎓' },
    { type:'video',   title:'Andrej Karpathy — YouTube', sub:'Neural Nets: Zero to Hero', icon:'🎬' },
    { type:'course',  title:'Deep Learning Specialisation', sub:'Andrew Ng · Coursera', icon:'🎓' },
    { type:'docs',    title:'Hugging Face Docs', sub:'Transformers, Datasets, PEFT', icon:'📘' },
    { type:'book',    title:'Hands-On ML (3rd Ed)', sub:"Aurélien Géron · O'Reilly", icon:'📚' },
  ]
},

// ───────────── CYBERSECURITY ─────────────
{ id:'cybersecurity', icon:'🛡️', title:'Cybersecurity Engineer', type:'role', diff:'Advanced', dur:'6–12 mo',
  desc:'Offensive & defensive security — pen testing, threat modelling, incident response.',
  about:'Covers both red team (attacking) and blue team (defending). You\'ll learn how attacks work at a technical level and how to build and maintain secure systems.\n\nHigh demand field — requires Linux proficiency and network fundamentals as a baseline.',
  prereqs:['Linux proficiency','Networking fundamentals (TCP/IP, DNS)','Basic Python or Bash scripting'],
  tags:['Linux','Nmap','OWASP','Metasploit','Wireshark','SIEM','Cryptography'],
  phases:[
    { label:'Foundations', nodes:[
      { name:'Networking & Protocols', tag:'core', desc:'TCP/IP, DNS, HTTP, TLS at a security level.', subs:['OSI & TCP/IP model','Packet analysis with Wireshark','DNS, DHCP, ARP','TLS handshake & PKI'] },
      { name:'OS Internals', tag:'core', desc:'Linux & Windows internals for security.', subs:['Linux privilege model','Windows Active Directory','Process & memory management','File permissions & ACLs'] },
      { name:'Cryptography', tag:'core', desc:'Encryption, hashing, PKI, certificates.', subs:['Symmetric vs asymmetric','AES, RSA, ECC','Hash functions (SHA-256, bcrypt)','TLS certs & PKI','Digital signatures'] },
    ]},
    { label:'Offensive Security', nodes:[
      { name:'Reconnaissance', tag:'core', desc:'OSINT, scanning, enumeration.', subs:['OSINT techniques','Nmap port scanning','Service enumeration','Shodan & Censys','Subdomain enumeration'] },
      { name:'Web App Attacks (OWASP Top 10)', tag:'core', desc:'SQLi, XSS, CSRF, IDOR, SSRF.', subs:['SQL Injection','Cross-Site Scripting (XSS)','CSRF & clickjacking','IDOR & broken access control','SSRF vulnerabilities'] },
      { name:'Network Attacks', tag:'optional', desc:'MITM, ARP spoofing, sniffing.', subs:['ARP poisoning','Man-in-the-middle','Password sniffing','Evil-twin Wi-Fi'] },
      { name:'Exploitation', tag:'optional', desc:'Metasploit, privilege escalation.', subs:['Metasploit basics','Common CVEs','Linux privesc','Windows privesc'] },
    ]},
    { label:'Defensive Security', nodes:[
      { name:'SIEM & Log Analysis', tag:'core', desc:'Splunk / Elastic — centralise and hunt.', subs:['Log normalisation','SIEM correlation rules','Splunk SPL queries','Alert fatigue management'] },
      { name:'Incident Response', tag:'core', desc:'Detection, containment, forensics, recovery.', subs:['IR lifecycle (PICERL)','Evidence preservation','Memory forensics (Volatility)','Timeline analysis'] },
      { name:'Vulnerability Management', tag:'core', desc:'Scanning, patching, risk scoring.', subs:['Nessus / OpenVAS','CVSS scoring','Patch management lifecycle','Responsible disclosure'] },
      { name:'Cloud Security', tag:'core', desc:'IAM misconfigs, exposed buckets, cloud attacks.', subs:['IAM least privilege','S3 bucket security','CloudTrail auditing','Secrets management (Vault)'] },
    ]},
    { label:'DevSecOps', nodes:[
      { name:'Shift Left Security', tag:'optional', desc:'Security baked into CI/CD.', subs:['SAST / DAST in CI pipelines','Dependency scanning (Snyk)','Container scanning (Trivy)','Secret scanning in Git'] },
      { name:'Zero Trust Architecture', tag:'optional', desc:'Identity-centric, perimeter-less security.', subs:['Microsegmentation','Just-in-time access','SASE / SSE frameworks'] },
    ]},
  ],
  resources:[
    { type:'course',  title:'TryHackMe', sub:'tryhackme.com · Gamified learning', icon:'🎓' },
    { type:'course',  title:'HackTheBox Academy', sub:'hackthebox.com · Hands-on labs', icon:'🎓' },
    { type:'video',   title:'NetworkChuck — YouTube', sub:'Security & networking for beginners', icon:'🎬' },
    { type:'article', title:'OWASP Foundation', sub:'owasp.org · Web security standards', icon:'📄' },
  ]
},

// ───────────── MOBILE ─────────────
{ id:'mobile', icon:'📱', title:'React Native Developer', type:'role', diff:'Intermediate', dur:'4–7 mo',
  desc:'Native-quality iOS & Android apps with JavaScript and Expo.',
  about:'Build genuinely native mobile apps with React Native and Expo. This roadmap goes from project setup to publishing on App Store and Google Play, covering navigation, native APIs, and state management.\n\nRequires React.js fundamentals.',
  prereqs:['React.js fundamentals','Basic JavaScript','npm / yarn experience'],
  tags:['React Native','Expo','TypeScript','iOS','Android','Navigation','AsyncStorage'],
  phases:[
    { label:'Core RN', nodes:[
      { name:'Expo Setup', tag:'core', desc:'Project scaffolding with Expo managed workflow.', subs:['create-expo-app','Expo Go testing','Metro bundler','File structure overview'] },
      { name:'Core Components', tag:'core', desc:'View, Text, Image, ScrollView, FlatList.', subs:['View & Text','StyleSheet API','FlatList & SectionList','SafeAreaView','KeyboardAvoidingView'] },
      { name:'Styling', tag:'core', desc:'Flexbox-based styling (column by default).', subs:['Flexbox in RN','Absolute positioning','Platform-specific styles','NativeWind (Tailwind)'] },
      { name:'Touch & Gestures', tag:'core', desc:'Pressable, Gesture Handler, Reanimated.', subs:['Pressable & onPress','react-native-gesture-handler','react-native-reanimated','Haptic feedback'] },
    ]},
    { label:'Navigation', nodes:[
      { name:'Expo Router', tag:'core', desc:'File-based routing for React Native.', subs:['Stack, tabs, drawer','Dynamic routes','Deep links','Route params'] },
      { name:'React Navigation', tag:'alt', desc:'Traditional navigation library.', subs:['Stack navigator','Bottom tabs','Drawer navigator','Nested navigators'] },
    ]},
    { label:'State & Data', nodes:[
      { name:'State Management', tag:'core', desc:'Zustand or Redux Toolkit.', subs:['Zustand stores','React Query (TanStack)','MMKV persistence','Context API limits'] },
      { name:'Networking', tag:'core', desc:'Fetch, Axios, React Query.', subs:['fetch vs axios','React Query mutations','Loading & error states','Optimistic updates'] },
      { name:'Local Storage', tag:'core', desc:'AsyncStorage, SQLite, MMKV, SecureStore.', subs:['AsyncStorage basics','MMKV (fast)','expo-sqlite','SecureStore for tokens'] },
    ]},
    { label:'Native APIs & Publishing', nodes:[
      { name:'Camera & Media', tag:'optional', desc:'expo-camera, image picker, video.', subs:['expo-camera permissions','expo-image-picker','expo-av audio/video'] },
      { name:'Push Notifications', tag:'core', desc:'expo-notifications, APNs, FCM.', subs:['Permission flow','Expo push tokens','Local notifications','Background notifications'] },
      { name:'Location & Maps', tag:'optional', desc:'expo-location, react-native-maps.', subs:['Foreground & background location','Maps integration','Places API','Geofencing'] },
      { name:'App Store & Google Play', tag:'core', desc:'Signing, TestFlight, Play Console.', subs:['Apple Developer account','Bundle ID & certs','TestFlight beta','Keystore & signing','AAB vs APK'] },
    ]},
  ],
  resources:[
    { type:'docs',   title:'React Native Docs', sub:'reactnative.dev', icon:'📘' },
    { type:'docs',   title:'Expo Documentation', sub:'docs.expo.dev', icon:'📘' },
    { type:'video',  title:'Simon Grimm — YouTube', sub:'Expo Router & RN tutorials', icon:'🎬' },
    { type:'course', title:'RN — Zero to Mastery', sub:'Udemy comprehensive course', icon:'🎓' },
  ]
},

// ═══════════ SKILL BASED ═══════════

// ───────────── TYPESCRIPT ─────────────
{ id:'typescript', icon:'🔷', title:'TypeScript', type:'skill', diff:'Beginner', dur:'2–4 wk',
  desc:'Add static types to JavaScript for safer, more maintainable codebases.',
  about:'TypeScript is a superset of JavaScript adding optional static typing. It compiles to plain JS and integrates with any project. Teams that adopt TypeScript typically see fewer runtime bugs and dramatically better IDE support.\n\nLearn it once, use it everywhere.',
  prereqs:['JavaScript fundamentals','ES6+ syntax (arrow functions, destructuring, modules)'],
  tags:['TypeScript','Types','Generics','Utility Types','React','Node.js'],
  phases:[
    { label:'Core Types', nodes:[
      { name:'Primitive Types', tag:'core', desc:'string, number, boolean, null, undefined, any, unknown, never.', subs:['Type annotations','Type inference','any vs unknown','never type use cases'] },
      { name:'Object Types', tag:'core', desc:'Interface vs type alias, optional, readonly.', subs:['interface definition','type alias syntax','Optional (?) & readonly','Index signatures'] },
      { name:'Arrays & Tuples', tag:'core', desc:'Typed arrays and fixed-length tuples.', subs:['Array<T> vs T[]','Tuple types','Rest elements in tuples'] },
      { name:'Union & Intersection', tag:'core', desc:'Combine types with | and &.', subs:['Union types (A | B)','Intersection (A & B)','Discriminated unions','Type guards (typeof, in, instanceof)'] },
    ]},
    { label:'Advanced Types', nodes:[
      { name:'Generics', tag:'core', desc:'Reusable, type-safe functions and classes.', subs:['Generic functions <T>','Generic interfaces','Constraints (extends)','Default type params'] },
      { name:'Utility Types', tag:'core', desc:'Partial, Required, Pick, Omit, Record, etc.', subs:['Partial<T>, Required<T>','Pick<T,K>, Omit<T,K>','Record<K,V>','ReturnType<F>, Parameters<F>'] },
      { name:'Conditional Types', tag:'optional', desc:'Type-level if/else.', subs:['T extends U ? X : Y','infer keyword','Distributive conditional types'] },
      { name:'Mapped Types', tag:'optional', desc:'Transform object types programmatically.', subs:['{ [K in keyof T]: ... }','+readonly, -? modifiers','Key remapping with as'] },
      { name:'Template Literal Types', tag:'optional', desc:'Construct string types dynamically.', subs:['`${string}` types','Union + template literal','Uppercase/Lowercase helpers'] },
    ]},
    { label:'TS in Practice', nodes:[
      { name:'tsconfig.json', tag:'core', desc:'Compiler flags, strict mode, paths.', subs:['strict mode flags','target & module','paths for aliases','include & exclude'] },
      { name:'TS with React', tag:'core', desc:'Type props, state, events, refs.', subs:['Typing component props','useState & useRef types','Typing event handlers','Generic components'] },
      { name:'TS with Node.js', tag:'optional', desc:'Type Express routes, env vars.', subs:['@types/node, @types/express','Typed request/response','Env var typing','Module augmentation'] },
      { name:'Declaration Files (.d.ts)', tag:'optional', desc:'Write types for untyped libraries.', subs:['declare module','Ambient declarations','DefinitelyTyped (@types/...)'] },
    ]},
  ],
  resources:[
    { type:'docs',   title:'TypeScript Handbook', sub:'typescriptlang.org', icon:'📘' },
    { type:'course', title:'Total TypeScript', sub:'Matt Pocock · free exercises', icon:'🎓' },
    { type:'video',  title:'TypeScript — Fireship', sub:'YouTube · 100 seconds + full course', icon:'🎬' },
  ]
},

// ───────────── DOCKER ─────────────
{ id:'docker', icon:'🐳', title:'Docker', type:'skill', diff:'Beginner', dur:'2–3 wk',
  desc:'Package and run apps in isolated containers — essential for every modern developer.',
  about:'Docker solves "works on my machine" by packaging apps and their dependencies into portable containers. Every developer and deployment pipeline uses it today.\n\nThis roadmap goes from installation to production-ready multi-container setups with Docker Compose.',
  prereqs:['Basic Linux/terminal knowledge','Understanding of what an application server does'],
  tags:['Docker','Dockerfile','Docker Compose','Volumes','Networking','Registries'],
  phases:[
    { label:'Docker Basics', nodes:[
      { name:'Installation & Setup', tag:'core', desc:'Docker Desktop or Engine.', subs:['Docker Desktop (Mac/Win)','Docker Engine (Linux)','Post-install config','Docker Hub account'] },
      { name:'Images & Containers', tag:'core', desc:'Core concepts.', subs:['What is an image?','What is a container?','docker run, ps, stop, rm','docker images, pull, rmi','Container lifecycle states'] },
      { name:'Writing Dockerfiles', tag:'core', desc:'Build images from scratch.', subs:['FROM, RUN, COPY, ADD','WORKDIR, EXPOSE, CMD, ENTRYPOINT','ENV & ARG','Layer caching','`.dockerignore` file'] },
      { name:'Multi-Stage Builds', tag:'core', desc:'Smaller production images.', subs:['FROM … AS builder','COPY --from=builder','Shrinking final image','Separating build & runtime'] },
    ]},
    { label:'Networking & Storage', nodes:[
      { name:'Volumes', tag:'core', desc:'Persist data outside containers.', subs:['Named volumes','Bind mounts (-v)','tmpfs mounts','Volume drivers'] },
      { name:'Networking', tag:'core', desc:'Container-to-container & host comms.', subs:['Bridge network (default)','docker network create','Container DNS','Port mapping (-p)'] },
    ]},
    { label:'Docker Compose & Production', nodes:[
      { name:'Docker Compose', tag:'core', desc:'Multi-container apps as YAML.', subs:['services, volumes, networks','depends_on & healthcheck','`.env` files','docker compose up/down/logs/ps'] },
      { name:'Compose for Dev', tag:'core', desc:'Hot-reload, databases, tooling.', subs:['Bind mounts for live reload','DB services (Postgres, Redis, Mongo)','Override files','Profiles for optional services'] },
      { name:'Registries & Security', tag:'core', desc:'Push images & secure them.', subs:['docker login, push, pull','Tagging strategy','GHCR & AWS ECR','Non-root user','Trivy image scanning'] },
    ]},
  ],
  resources:[
    { type:'docs',   title:'Docker Official Docs', sub:'docs.docker.com', icon:'📘' },
    { type:'video',  title:'TechWorld with Nana', sub:'YouTube · Docker for beginners', icon:'🎬' },
    { type:'course', title:'Docker Mastery — Udemy', sub:'Bret Fisher · most popular course', icon:'🎓' },
    { type:'article',title:'Play with Docker', sub:'labs.play-with-docker.com', icon:'📄' },
  ]
},

// ───────────── GIT ─────────────
{ id:'git', icon:'🌿', title:'Git & GitHub', type:'skill', diff:'Beginner', dur:'1–2 wk',
  desc:'Version control every dev must master — commits, branches, rebasing, collaboration.',
  about:'Git is the world\'s most used version control system. Every team uses it. This roadmap goes from first commit to advanced workflows like interactive rebasing, hooks, and large-team collaboration patterns.',
  prereqs:['Terminal/command line basics'],
  tags:['Git','GitHub','Branching','Rebasing','Hooks','Pull Requests','CI/CD'],
  phases:[
    { label:'Git Basics', nodes:[
      { name:'Core Concepts', tag:'core', desc:'Repos, commits, staging area.', subs:['git init & clone','Working tree vs index vs HEAD','git add, commit, status, log','.gitignore patterns'] },
      { name:'Branching', tag:'core', desc:'Create, switch, merge branches.', subs:['git branch, checkout, switch','Fast-forward vs 3-way merge','Merge conflicts','git branch -d cleanup'] },
      { name:'Remotes', tag:'core', desc:'Push, pull, fetch with GitHub.', subs:['git remote add origin','git push, pull, fetch','Tracking branches','Shallow clones (--depth)'] },
    ]},
    { label:'Intermediate Git', nodes:[
      { name:'Rebasing', tag:'core', desc:'Linear history, interactive rebase.', subs:['git rebase vs merge','Interactive rebase (-i)','Squashing commits','Rebase onto another branch','When NOT to rebase (public branches)'] },
      { name:'Stashing', tag:'core', desc:'Save work-in-progress temporarily.', subs:['git stash push/pop/list','Stash with message','apply vs pop','Stash specific files (--pathspec)'] },
      { name:'Undoing Changes', tag:'core', desc:'reset, revert, restore — know the difference.', subs:['git restore (discard unstaged)','reset --soft/mixed/hard','git revert (safe undo)','git reflog (recover lost commits)'] },
      { name:'Git Hooks', tag:'optional', desc:'Automate tasks on commit/push.', subs:['pre-commit hooks','commit-msg validation','Husky (JS projects)','lint-staged'] },
    ]},
    { label:'GitHub Collaboration', nodes:[
      { name:'Pull Requests', tag:'core', desc:'Propose, review, merge.', subs:['Fork & PR workflow','PR templates','Code review etiquette','Resolving review comments','Draft PRs'] },
      { name:'GitHub Actions', tag:'optional', desc:'CI/CD directly from GitHub.', subs:['Workflow YAML basics','on: push/pull_request','Jobs, steps, runners','Using marketplace actions'] },
      { name:'GitHub Features', tag:'optional', desc:'Issues, Projects, Discussions, Releases.', subs:['GitHub Issues & labels','GitHub Projects (kanban)','Releases & tags','GitHub Codespaces'] },
    ]},
  ],
  resources:[
    { type:'article',title:'Pro Git (free book)', sub:'git-scm.com/book', icon:'📄' },
    { type:'video',  title:'Git Crash Course', sub:'Traversy Media · YouTube', icon:'🎬' },
    { type:'article',title:'Oh Shit, Git!?!', sub:'ohshitgit.com · common mistakes', icon:'📄' },
    { type:'course', title:'Learn Git Branching', sub:'learngitbranching.js.org · interactive', icon:'🎓' },
  ]
},

// ───────────── SQL ─────────────
{ id:'sql', icon:'🗄️', title:'SQL & Databases', type:'skill', diff:'Beginner', dur:'3–5 wk',
  desc:'Write powerful queries, design schemas, and understand relational databases deeply.',
  about:'SQL is the lingua franca of data. Whether you\'re a frontend dev, backend engineer, data analyst, or ML practitioner — understanding SQL is indispensable. This roadmap covers writing queries, designing schemas, and optimising performance.',
  prereqs:['Basic programming logic','Ability to think in tables/spreadsheets'],
  tags:['SQL','PostgreSQL','MySQL','Indexes','Transactions','Query Optimisation','Schema Design'],
  phases:[
    { label:'SQL Fundamentals', nodes:[
      { name:'Core Queries', tag:'core', desc:'SELECT, INSERT, UPDATE, DELETE.', subs:['SELECT with WHERE, ORDER BY, LIMIT','INSERT INTO','UPDATE with WHERE','DELETE with WHERE','DISTINCT & aliases'] },
      { name:'Filtering & Functions', tag:'core', desc:'Conditions, aggregations, string/date functions.', subs:['AND, OR, NOT, IN, BETWEEN, LIKE','COUNT, SUM, AVG, MIN, MAX','GROUP BY & HAVING','String functions (CONCAT, UPPER, TRIM)','Date functions (NOW, EXTRACT, DATE_TRUNC)'] },
      { name:'Joins', tag:'core', desc:'Combine data across tables.', subs:['INNER JOIN','LEFT / RIGHT JOIN','FULL OUTER JOIN','CROSS JOIN','Self-join','Join on multiple conditions'] },
      { name:'Subqueries & CTEs', tag:'core', desc:'Nested queries and WITH clauses.', subs:['Subquery in WHERE','Subquery in FROM','Correlated subqueries','WITH (CTE) syntax','Recursive CTEs'] },
    ]},
    { label:'Schema Design', nodes:[
      { name:'Data Types', tag:'core', desc:'Choosing the right type for each column.', subs:['INTEGER, BIGINT, NUMERIC','VARCHAR, TEXT','BOOLEAN','DATE, TIMESTAMP, TIMESTAMPTZ','UUID vs SERIAL'] },
      { name:'Constraints', tag:'core', desc:'Primary keys, foreign keys, unique, not null.', subs:['PRIMARY KEY','FOREIGN KEY & CASCADE','UNIQUE & NOT NULL','CHECK constraints','DEFAULT values'] },
      { name:'Normalisation', tag:'core', desc:'1NF → 3NF — reduce data redundancy.', subs:['1NF: atomic values','2NF: remove partial deps','3NF: remove transitive deps','When to denormalise','Practical schema patterns'] },
      { name:'Indexing', tag:'core', desc:'Speed up reads without slowing writes too much.', subs:['B-tree index basics','Composite indexes','Partial indexes','EXPLAIN ANALYZE','Index maintenance costs'] },
    ]},
    { label:'Advanced SQL', nodes:[
      { name:'Window Functions', tag:'core', desc:'ROW_NUMBER, RANK, LAG, LEAD, running totals.', subs:['OVER (PARTITION BY … ORDER BY)','ROW_NUMBER & RANK','LAG & LEAD','Running SUM / AVG','NTILE'] },
      { name:'Transactions & ACID', tag:'core', desc:'Atomicity, consistency, isolation, durability.', subs:['BEGIN / COMMIT / ROLLBACK','Isolation levels','Deadlocks & prevention','Savepoints'] },
      { name:'Query Optimisation', tag:'core', desc:'Understand and fix slow queries.', subs:['EXPLAIN ANALYZE','Seq scan vs index scan','Vacuum & analyse','Connection pooling (PgBouncer)'] },
      { name:'PostgreSQL-Specific', tag:'optional', desc:'JSONB, full-text search, extensions.', subs:['JSONB operators','Full-text search (tsvector)','pg_trgm similarity','pgvector for embeddings'] },
    ]},
  ],
  resources:[
    { type:'course',  title:'SQLZoo', sub:'sqlzoo.net · free interactive exercises', icon:'🎓' },
    { type:'course',  title:'Mode Analytics SQL Tutorial', sub:'mode.com · practical SQL', icon:'🎓' },
    { type:'docs',    title:'PostgreSQL Documentation', sub:'postgresql.org · full reference', icon:'📘' },
    { type:'book',    title:'Learning SQL', sub:'Alan Beaulieu · O\'Reilly', icon:'📚' },
  ]
},

// ───────────── UI/UX ─────────────
{ id:'ui-ux', icon:'🎨', title:'UI / UX Design', type:'skill', diff:'Beginner', dur:'3–5 mo',
  desc:'Design beautiful, usable interfaces — from wireframes to Figma prototypes.',
  about:'UI/UX design is the art of building interfaces people love. You\'ll learn visual design principles, user research methods, Figma fluency, and how to build design systems.\n\nMany developers who learn design become far more effective full-stack contributors.',
  prereqs:['No prior design experience needed','Curiosity about why some apps feel great'],
  tags:['Figma','Typography','Color Theory','UX Research','Design Systems','Prototyping','Accessibility'],
  phases:[
    { label:'Visual Design', nodes:[
      { name:'Typography', tag:'core', desc:'Typefaces, hierarchy, readability, pairing.', subs:['Font anatomy (baseline, x-height)','Serif vs sans-serif','Typographic scale','Line height & letter spacing','Font pairing techniques'] },
      { name:'Colour Theory', tag:'core', desc:'Hue, saturation, contrast, colour systems.', subs:['Colour wheel & relationships','HSL vs RGB vs HEX','WCAG contrast ratios','Building a colour palette','Dark mode token systems'] },
      { name:'Layout & Composition', tag:'core', desc:'Grid systems, spacing, visual hierarchy.', subs:['8-point grid system','Column grids','Whitespace as design tool','Visual weight & balance','Z/F-pattern reading'] },
      { name:'Gestalt Principles', tag:'core', desc:'How the brain perceives visual groups.', subs:['Proximity & similarity','Continuity & closure','Figure/ground','Common fate'] },
    ]},
    { label:'UX Fundamentals', nodes:[
      { name:'User Research', tag:'core', desc:'Interviews, surveys, usability testing.', subs:['User interview techniques','Survey design','Usability testing methods','Card sorting & tree testing','Affinity mapping'] },
      { name:'Information Architecture', tag:'core', desc:'Navigation, content structure, site maps.', subs:['Site map creation','User flows','Navigation patterns','Progressive disclosure'] },
      { name:'Heuristic Evaluation', tag:'optional', desc:"Nielsen's 10 usability heuristics.", subs:['Visibility of system status','User control & freedom','Error prevention','Recognition over recall'] },
    ]},
    { label:'Figma', nodes:[
      { name:'Figma Basics', tag:'core', desc:'Frames, layers, shapes, text, styles.', subs:['Canvas navigation','Frames vs groups','Vector tools','Colour & text styles','Grids & guides'] },
      { name:'Auto Layout', tag:'core', desc:'Responsive components with auto layout.', subs:['Horizontal & vertical layout','Padding & gap','Fill/hug/fixed sizing','Nested auto layout'] },
      { name:'Components & Variants', tag:'core', desc:'Reusable, scalable UI components.', subs:['Component creation & naming','Boolean, text, nested props','Variant groups','Instances & overrides'] },
      { name:'Prototyping', tag:'core', desc:'Interactive flows and presentations.', subs:['Frame connections','Smart animate','Overlay & scroll','Prototype flows','Presentation mode'] },
      { name:'Design Systems & Tokens', tag:'optional', desc:'Systematic, scalable design language.', subs:['Foundation tokens','Core components','Figma Variables','Handoff to devs (Dev Mode)'] },
    ]},
  ],
  resources:[
    { type:'course',  title:'Google UX Design Certificate', sub:'Coursera · beginner path', icon:'🎓' },
    { type:'video',   title:'DesignCourse — YouTube', sub:'UI/UX, Figma tutorials', icon:'🎬' },
    { type:'article', title:'Nielsen Norman Group', sub:'nngroup.com · UX research', icon:'📄' },
    { type:'book',    title:"Don't Make Me Think", sub:"Steve Krug · classic usability", icon:'📚' },
  ]
},

];

/* ═══════════ STATE ═══════════ */
const S = {
  roadmap: null,
  tab: 'map',
  filter: 'all',
  prog: JSON.parse(localStorage.getItem('vd_prog') || '{}'),
};

const save = () => localStorage.setItem('vd_prog', JSON.stringify(S.prog));
const nk   = (rid, pi, ni)      => `${rid}|${pi}|${ni}`;
const sk   = (rid, pi, ni, si)  => `${rid}|${pi}|${ni}|${si}`;
const isDone = (rid, pi, ni)     => !!S.prog[nk(rid,pi,ni)];
const isSubDone = (rid, pi, ni, si) => !!S.prog[sk(rid,pi,ni,si)];

function toggleNode(rid, pi, ni) {
  const k = nk(rid,pi,ni); S.prog[k] = !S.prog[k];
  const node = RM.find(r=>r.id===rid).phases[pi].nodes[ni];
  if (node.subs) node.subs.forEach((_,si) => { S.prog[sk(rid,pi,ni,si)] = S.prog[k]; });
  save();
}
function toggleSub(rid, pi, ni, si) { const k = sk(rid,pi,ni,si); S.prog[k] = !S.prog[k]; save(); }

function roadmapProg(r) {
  let done=0, total=0;
  r.phases.forEach((p,pi) => p.nodes.forEach((_,ni)=>{ total++; if(isDone(r.id,pi,ni)) done++; }));
  return { done, total, pct: total ? Math.round(done/total*100) : 0 };
}

function globalProg() {
  let done=0, total=0;
  RM.forEach(r => { const p=roadmapProg(r); done+=p.done; total+=p.total; });
  return { done, total, pct: total ? Math.round(done/total*100) : 0 };
}

/* ═══════════ VIEWS ═══════════ */
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function tickUp(elId, target) {
  const el = document.getElementById(elId); let n=0;
  const iv = setInterval(()=>{ n=Math.min(n+Math.ceil(target/28), target); el.textContent=n; if(n>=target) clearInterval(iv); },28);
}

/* ── HOME ── */
function renderHome() {
  S.roadmap = null; showView('viewHome');
  activeSidebarItem(null);
  const total = RM.reduce((a,r)=>a+r.phases.reduce((b,p)=>b+p.nodes.length,0),0);
  const {done} = globalProg();
  tickUp('cntRoadmaps', RM.length);
  tickUp('cntTopics', total);
  tickUp('cntDone', done);
  renderHomeGrid();
  renderSidebar();
  updateGlobalBar();
}

function renderHomeGrid() {
  const grid = document.getElementById('homeGrid');
  const filtered = RM.filter(r => S.filter==='all' || r.type===S.filter);
  grid.innerHTML = filtered.map((r,i) => {
    const {done,total,pct} = roadmapProg(r);
    return `<div class="hcard" data-id="${r.id}" style="animation-delay:${i*.05}s" tabindex="0">
      <div class="hcard-top"><span class="hcard-icon">${r.icon}</span><span class="hcard-badge badge-${r.type}">${r.type==='role'?'Role Based':'Skill Based'}</span></div>
      <div class="hcard-title">${r.title}</div>
      <div class="hcard-desc">${r.desc}</div>
      <div class="hcard-bar-wrap"><div class="hcard-bar" style="width:${pct}%"></div></div>
      <div class="hcard-foot">
        <div class="hcard-meta"><span>📚 ${total}</span><span>⏱ ${r.dur}</span></div>
        <span class="hcard-pct">${pct}%</span>
      </div>
    </div>`;
  }).join('');
  grid.querySelectorAll('.hcard').forEach(el => {
    el.addEventListener('click', ()=>openRoadmap(el.dataset.id));
    el.addEventListener('keydown', e=>{ if(e.key==='Enter') openRoadmap(el.dataset.id); });
  });
}

/* ── SIDEBAR ── */
function renderSidebar() {
  ['Role','Skill'].forEach(type => {
    const id = 'sidebar'+type;
    const items = RM.filter(r => r.type===type.toLowerCase());
    document.getElementById(id).innerHTML = items.map(r => {
      const {pct} = roadmapProg(r);
      return `<div class="s-item${S.roadmap?.id===r.id?' active':''}" data-id="${r.id}">
        <span class="s-item__icon">${r.icon}</span>
        <span class="s-item__name">${r.title}</span>
        ${pct>0?`<span class="s-item__pct">${pct}%`:''}
      </div>`;
    }).join('');
    document.getElementById(id).querySelectorAll('.s-item').forEach(el =>
      el.addEventListener('click', ()=>openRoadmap(el.dataset.id))
    );
  });
}

function activeSidebarItem(id) {
  document.querySelectorAll('.s-item').forEach(el =>
    el.classList.toggle('active', el.dataset.id===id)
  );
}

function updateGlobalBar() {
  const {pct} = globalProg();
  document.getElementById('globalPct').textContent = pct+'%';
  document.getElementById('globalFill').style.width = pct+'%';
}

/* ── DETAIL ── */
function openRoadmap(id) {
  S.roadmap = RM.find(r=>r.id===id);
  if (!S.roadmap) return;
  S.tab = 'map';
  renderDetail();
  showView('viewDetail');
  activeSidebarItem(id);
  document.querySelector('.main-area').scrollTop = 0;
}

function renderDetail() {
  const r = S.roadmap;
  const {pct} = roadmapProg(r);
  document.getElementById('dhIcon').textContent = r.icon;
  document.getElementById('dhTitle').textContent = r.title;

  const diffCol = {Beginner:'badge-skill', Intermediate:'badge-role', Advanced:'badge-skill'};
  document.getElementById('dhMeta').innerHTML =
    `<span class="dh-chip ${r.type==='role'?'badge-role':'badge-skill'}">${r.type==='role'?'Role Based':'Skill Based'}</span>
     <span class="dh-tag">⏱ ${r.dur}</span>
     <span class="dh-tag">⚡ ${r.diff}</span>`;

  // ring
  const circ=113.1, offset=circ-(pct/100)*circ;
  document.getElementById('ringCircle').style.strokeDashoffset = offset;
  document.getElementById('ringPct').textContent = pct+'%';

  // tabs + panels
  document.querySelectorAll('.dtab').forEach(b=>b.classList.toggle('active', b.dataset.tab===S.tab));
  document.querySelectorAll('.dpanel').forEach(p=>p.classList.toggle('active', p.id==='panel'+cap(S.tab)));

  if (S.tab==='map') renderMap();
  else if (S.tab==='resources') renderResources();
  else renderAbout();
}

function cap(s) { return s.charAt(0).toUpperCase()+s.slice(1); }

function updateRing() {
  if (!S.roadmap) return;
  const {pct} = roadmapProg(S.roadmap);
  const circ=113.1;
  document.getElementById('ringCircle').style.strokeDashoffset = circ-(pct/100)*circ;
  document.getElementById('ringPct').textContent = pct+'%';
}

/* ── ROADMAP DIAGRAM ── */
function renderMap() {
  const r = S.roadmap;
  const canvas = document.getElementById('mapCanvas');
  canvas.innerHTML = r.phases.map((phase, pi) => {
    const phDone  = phase.nodes.filter((_,ni)=>isDone(r.id,pi,ni)).length;
    const nodesHTML = phase.nodes.map((node, ni) => {
      const done   = isDone(r.id, pi, ni);
      const isLast = ni === phase.nodes.length-1;

      // subitems grid
      const subHTML = node.subs ? `<div class="map-subitems">
        ${node.subs.map((s,si)=>{
          const sd = isSubDone(r.id,pi,ni,si);
          return `<div class="map-sub${sd?' done':''}" data-pi="${pi}" data-ni="${ni}" data-si="${si}">
            <div class="sub-dot"></div>
            <span class="sub-name">${s}</span>
          </div>`;
        }).join('')}
      </div>` : '';

      return `<div class="map-row">
        <div class="map-row-connector">
          <div class="map-dot${done?' done':''}" data-pi="${pi}" data-ni="${ni}"></div>
          ${!isLast?`<div class="map-vline${done?' done':''}"></div>`:''}
        </div>
        <div class="map-node${done?' done':''}" data-pi="${pi}" data-ni="${ni}">
          <div class="map-node-head">
            <span class="map-node-name">${node.name}</span>
            <div class="map-node-right">
              <span class="ntag ntag-${node.tag}">${node.tag}</span>
              <button class="ncheck${done?' done':''}" data-pi="${pi}" data-ni="${ni}" aria-label="Toggle ${node.name}">✓</button>
            </div>
          </div>
          <div class="map-node-desc">${node.desc}</div>
          ${subHTML}
        </div>
      </div>`;
    }).join('');

    return `<div class="map-section">
      <div class="map-section-header">
        <div class="map-section-num">${pi+1}</div>
        <span class="map-section-title">${phase.label}</span>
        <div class="map-section-line"></div>
        <span class="map-section-prog">${phDone}/${phase.nodes.length}</span>
      </div>
      <div class="map-tree">${nodesHTML}</div>
    </div>`;
  }).join('');

  // node checks
  canvas.querySelectorAll('.ncheck').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleNode(r.id, +btn.dataset.pi, +btn.dataset.ni);
      renderMap(); updateRing(); renderSidebar(); updateGlobalBar();
    });
  });
  // sub toggles
  canvas.querySelectorAll('.map-sub').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      toggleSub(r.id, +el.dataset.pi, +el.dataset.ni, +el.dataset.si);
      renderMap();
    });
  });
}

/* ── RESOURCES ── */
function renderResources() {
  const r = S.roadmap;
  const cls = {video:'ri-video',article:'ri-article',course:'ri-course',docs:'ri-docs',book:'ri-book'};
  document.getElementById('resGrid').innerHTML = r.resources.map(res=>`
    <div class="res-card">
      <div class="res-icon ${cls[res.type]||'ri-article'}">${res.icon}</div>
      <div class="res-body">
        <div class="res-title">${res.title}</div>
        <div class="res-sub">${res.sub}</div>
        <span class="res-type">${res.type}</span>
      </div>
    </div>`).join('');
}

/* ── ABOUT ── */
function renderAbout() {
  const r = S.roadmap;
  const pre = r.prereqs
    ? `<div class="about-prereq"><ul>${r.prereqs.map(p=>`<li>${p}</li>`).join('')}</ul></div>` : '';
  document.getElementById('aboutBox').innerHTML = `
    <h2>${r.title}</h2>
    <p>${r.about.replace(/\n/g,'</p><p>')}</p>
    <h3>Prerequisites</h3>${pre}
    <h3>Key Technologies</h3>
    <div class="tag-cloud">${r.tags.map(t=>`<span>${t}</span>`).join('')}</div>`;
}

/* ═══════════ SEARCH ═══════════ */
function initSearch() {
  const inp = document.getElementById('searchInput');
  const dd  = document.getElementById('searchDropdown');
  inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase().trim();
    if (!q) { dd.classList.remove('show'); return; }
    const hits = RM.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.tags.some(t=>t.toLowerCase().includes(q)) ||
      r.desc.toLowerCase().includes(q)
    ).slice(0,7);
    if (!hits.length) { dd.classList.remove('show'); return; }
    dd.innerHTML = hits.map(r=>`
      <div class="sd-item" data-id="${r.id}">
        <span class="sd-icon">${r.icon}</span>
        <div><div class="sd-name">${r.title}</div><div class="sd-cat">${r.type==='role'?'Role Based':'Skill Based'} · ${r.diff}</div></div>
      </div>`).join('');
    dd.classList.add('show');
    dd.querySelectorAll('.sd-item').forEach(el=>el.addEventListener('click',()=>{
      openRoadmap(el.dataset.id); inp.value=''; dd.classList.remove('show');
    }));
  });
  document.addEventListener('click', e=>{
    if (!inp.contains(e.target) && !dd.contains(e.target)) dd.classList.remove('show');
  });
}

/* ═══════════ EVENTS ═══════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnBack').addEventListener('click', renderHome);

  document.getElementById('btnReset').addEventListener('click', () => {
    const r = S.roadmap; if (!r) return;
    if (!confirm(`Reset all progress for "${r.title}"?`)) return;
    Object.keys(S.prog).forEach(k=>{ if(k.startsWith(r.id+'|')) delete S.prog[k]; });
    save(); renderMap(); updateRing(); renderSidebar(); updateGlobalBar();
  });

  document.querySelectorAll('.dtab').forEach(btn=>btn.addEventListener('click',()=>{
    S.tab = btn.dataset.tab; renderDetail();
  }));

  document.querySelectorAll('.fchip').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.fchip').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); S.filter=btn.dataset.f; renderHomeGrid();
  }));

  document.getElementById('sidebarToggle').addEventListener('click',()=>{
    document.getElementById('sidebar').classList.toggle('closed');
  });

  document.getElementById('hamburger').addEventListener('click',()=>{
    document.getElementById('sidebar').classList.toggle('mobile-open');
  });

  initSearch();
  renderHome();
});