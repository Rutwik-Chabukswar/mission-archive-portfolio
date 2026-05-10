# Deployment Fixes Log

## Issue: Chatbot API "Network connection issue" (CORS + 502 Bad Gateway)

### Root Cause
The Vercel frontend was throwing a "Network connection issue. The intelligence server appears to be unreachable" error when users attempted to chat. The underlying issue was actually a **502 Bad Gateway** thrown by the Render backend (likely due to an application crash or out-of-memory error before recent fixes were deployed). Because a 502 response from Render's reverse proxy does not include `Access-Control-Allow-Origin` headers, the browser's strict security policies blocked the response, turning a 502 Server Error into a CORS Network Error.

### Error Logs
- **Frontend Console:** 
  `Access to fetch at 'https://mission-archive-backend.onrender.com/chat' from origin 'https://mission-archive-portfolio.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Frontend Console:**
  `POST https://mission-archive-backend.onrender.com/chat net::ERR_FAILED 502 (Bad Gateway)`

### Fix Applied
1. **Explicit CORS Configuration:** Updated `backend/app.py` to use an explicit array of origins exactly as requested, ensuring the middleware perfectly whitelists the frontend environments.
2. **Backward-Compatible Schema:** Ensured the frontend gracefully handles backend schema migrations by sending both `message` and `query` in the payload, and accepting both `response` and `answer` in the return data.

### Domain Rename (May 2026)
- **Old Domain:** `https://mission-archive-portfolio.vercel.app`
- **New Domain:** `https://rutwik-portfolio.vercel.app`
- **CORS Update:** Updated `backend/app.py` to allow both the old and new domains to ensure zero downtime during DNS/routing propagation.
- **Verification:** Searched frontend and backend for hardcoded references to the old domain. All systems securely rely on relative routing or environment variables.

### Deployment Checklist
1. Stage the files: `git add .`
2. Commit the changes: `git commit -m "fix(deployment): apply strict CORS configuration and prepare for production deployment"`
3. Push to GitHub: `git push origin main`
4. **Render Redeployment Verification:**
   - Wait for Render to finish building the backend.
   - Verify the "Out of memory" errors are resolved (due to the lazy-loading of ML models added earlier).
   - Test the root endpoint (`https://mission-archive-backend.onrender.com/`) in the browser.
5. **Vercel Frontend Verification:**
   - Wait for Vercel to complete the build.
   - Visit `https://mission-archive-portfolio.vercel.app`.
   - Send a test message in the Intelligence Terminal.

### Lessons Learned
- **CORS Masks Server Crashes:** A backend crash (502/503) will often be reported by the browser as a CORS error because reverse proxies do not append CORS headers to raw 5xx gateway errors. Always check the network tab for the actual HTTP status code.
- **Environment Parity:** Always ensure the frontend has a valid `.env` pointing to `localhost` during local development to prevent accidental testing against broken production servers.
