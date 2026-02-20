# API Setup Guide

The frontend calls the backend API Gateway for all calculator calculations. If calculations fail or show "Calculation failed. Ensure backend is running", follow these steps.

## Where to Change the API URL

1. **Environment variable**  
   Create or edit `.env.local` in the project root and set:

   ```
   NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8081
   ```

   Replace `8081` with the port where your backend/API Gateway runs (e.g. `3001`, `5000`).

2. **Restart Next.js**  
   After changing `.env.local`, restart the dev server: `npm run dev`

3. **Default value**  
   If `NEXT_PUBLIC_API_GATEWAY_URL` is not set, the app defaults to `http://localhost:8081`.

## Expected Backend Endpoints

The frontend sends POST requests to these paths (base URL + path):

| Calculator | Path |
|------------|------|
| EMI | `/calculator/loan/emi` |
| Home Loan | `/calculator/loan/home/emi` |
| Car Loan | `/calculator/loan/car/emi` |
| Personal Loan | `/calculator/loan/personal/emi` |
| Eligibility | `/calculator/loan/eligibility` |
| Prepayment | `/calculator/loan/prepayment` |
| Flat vs Reducing | `/calculator/loan/flat-vs-reducing` |
| Tenure | `/calculator/loan/tenure` |
| SIP | `/calculator/investment/sip` |
| Step-Up SIP | `/calculator/investment/step-up-sip` |
| Lumpsum | `/calculator/investment/lumpsum` |
| SWP | `/calculator/investment/swp` |
| CAGR | `/calculator/investment/cagr` |
| Others | See `src/lib/apiClient.js` |

## Troubleshooting

- **CORS errors** – Ensure the backend allows requests from `http://localhost:3000` (or your frontend origin).
- **Network Error** – Backend not reachable; check port and that it’s running.
- **404** – Path mismatch; verify backend routes use `/calculator/...` as above.
- **Wrong response format** – Check request/response shapes in `src/lib/apiClient.js` and your backend DTOs.
