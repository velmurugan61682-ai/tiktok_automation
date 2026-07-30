<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/839d7a6c-8e04-4242-b5f5-e1c8c1d0e66d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```
tiktok-automation-saas
├─ assets
│  └─ .aistudio
├─ data
│  └─ db.json
├─ index.html
├─ metadata.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ server.ts
├─ src
│  ├─ api
│  │  ├─ automation
│  │  │  └─ route.ts
│  │  ├─ chat
│  │  │  └─ route.ts
│  │  ├─ customers
│  │  │  └─ route.ts
│  │  ├─ dashboard
│  │  │  └─ route.ts
│  │  ├─ orders
│  │  │  └─ route.ts
│  │  └─ products
│  │     └─ route.ts
│  ├─ app
│  │  ├─ automation
│  │  │  └─ page.tsx
│  │  ├─ chat
│  │  │  └─ page.tsx
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ customers
│  │  │  └─ page.tsx
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  ├─ orders
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ privacy
│  │  │  └─ page.tsx
│  │  ├─ products
│  │  │  └─ page.tsx
│  │  └─ terms
│  │     └─ page.tsx
│  ├─ App.tsx
│  ├─ components
│  │  ├─ AuthContext.tsx
│  │  ├─ AutomationControl.tsx
│  │  ├─ CustomerProfiles.tsx
│  │  ├─ LiveChat.tsx
│  │  ├─ OrderList.tsx
│  │  ├─ ProductCatalog.tsx
│  │  ├─ SuperAdminDashboard.tsx
│  │  └─ TenantDashboard.tsx
│  ├─ index.css
│  ├─ lib
│  │  └─ db.ts
│  ├─ main.tsx
│  ├─ model
│  │  ├─ automation.ts
│  │  ├─ customer.ts
│  │  ├─ dashboard.ts
│  │  ├─ order.ts
│  │  └─ product.ts
│  ├─ repository
│  │  ├─ AutomationRepository.ts
│  │  ├─ CommentRepository.ts
│  │  ├─ ConversationRepository.ts
│  │  ├─ CustomerRepository.ts
│  │  ├─ NotificationRepository.ts
│  │  ├─ OrderRepository.ts
│  │  ├─ ProductRepository.ts
│  │  ├─ UserRepository.ts
│  │  └─ WorkspaceRepository.ts
│  ├─ services
│  │  ├─ AIService.ts
│  │  ├─ AutomationService.ts
│  │  ├─ ChatService.ts
│  │  ├─ CommentService.ts
│  │  ├─ DashboardService.ts
│  │  ├─ NotificationService.ts
│  │  ├─ OrderService.ts
│  │  ├─ ProductService.ts
│  │  └─ TikTokService.ts
│  └─ types.ts
├─ tsconfig.json
└─ vite.config.ts

```