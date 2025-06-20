# ShortLink: Modern URL Shortener

A modern, secure, and accessible URL shortener built with Next.js, MongoDB, NextAuth, and Tailwind CSS. Features robust authentication (email/password, Google OAuth), password reset, account linking, and a polished, accessible UI/UX. **Transactional email support (verification, password reset, etc.) coming soon!**

---

## ✨ Features

- **Modern UI/UX**: Responsive, accessible, and visually appealing dashboard, auth, and account pages.
- **Authentication**: Email/password + Google OAuth, with account linking and secure session management.
- **Email Verification**: *(Coming soon)*
- **Password Reset**: Secure forgot/reset password flows *(email delivery coming soon)*.
- **Account Management**: Change password, link/unlink Google or credentials, view account info.
- **Dashboard**: Manage, search, bulk delete, and export your short links. View analytics per link.
- **Accessibility**: ARIA labels, focus rings, keyboard navigation, and color contrast.
- **Production-Grade Security**: Follows best practices for authentication, validation, and error handling.
- **Extensible**: Easily add analytics, admin panel, dark mode, or more features.

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ShortLink
npm install
```

### 2. Environment Variables

Create a `.env.local` file with the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Run Locally

```bash
npm run dev
```

---

## 🔑 Authentication & User Flows

- **Sign Up**: Email/password or Google OAuth *(email verification coming soon)*.
- **Sign In**: *(Email verification enforcement coming soon)*
- **Forgot/Reset Password**: Secure, tokenized flow *(email delivery coming soon)*.
- **Account Linking**: Link/unlink Google and credentials from the account page.
- **Session Security**: All sensitive actions require authentication.

---

## 🖥️ Dashboard & Link Management

- **Create, search, and manage** your short links.
- **Bulk delete** and **export** links as CSV.
- **View analytics** for each link (clicks, created date).
- **Accessible table** with keyboard navigation and ARIA labels.

---

## ♿ Accessibility & UI/UX

- All forms and tables have ARIA labels, focus rings, and keyboard support.
- Color contrast and spacing optimized for readability.
- Loading spinners and feedback for all async actions.
- Responsive design for all devices.

---

## 🛠️ Advanced & Optional Features

- [ ] Dark mode toggle
- [ ] Advanced analytics & admin panel
- [x] Toast notifications for all async actions *(Planned: Use a library like react-hot-toast or sonner for user feedback on create, delete, sign in, sign up, password reset, etc. See Dashboard, Auth, and Account pages for integration points.)*
- [x] More empty state illustrations/messages *(Planned: Add friendly illustrations and helpful messages to dashboard, history, and analytics pages when no data is present. Improves user experience and onboarding.)*
- [ ] Unlink provider/account feature
- [ ] More screenshots and deployment instructions

---

### ℹ️ Implementation Notes

- **Toast Notifications:**
  - Use a notification library (e.g., [react-hot-toast](https://react-hot-toast.com/) or [sonner](https://sonner.emilkowal.ski/)) to provide real-time feedback for all async actions (create, delete, sign in, sign up, password reset, etc.).
  - Integrate toasts in Dashboard, Auth, and Account pages for success/error states.

- **Empty State Illustrations:**
  - Add SVG or illustration components and friendly messages to pages like Dashboard, History, and Analytics when there is no data.
  - Helps guide new users and improves the overall onboarding experience.

---

## 🖼️ Screenshots

<!-- Add screenshots here -->

---

## 📦 Deployment

- Deploy to Vercel, Netlify, or your preferred platform.
- Set all environment variables in your deployment dashboard.

---

## 🤝 Credits

- Built with [Next.js](https://nextjs.org/), [NextAuth.js](https://next-auth.js.org/), [MongoDB](https://www.mongodb.com/), [Tailwind CSS](https://tailwindcss.com/).
- UI icons by [Lucide](https://lucide.dev/).

---

## 📄 License

MIT

