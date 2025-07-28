 <img width="1916" height="944" alt="Hompage - Compare Price Website" src="https://github.com/user-attachments/assets/73ff7151-47a7-4362-a90b-39f02a0d9891" />

---
 
# PriceCompare

PriceCompare is a full‑stack web application that lets users compare product prices between Amazon South Africa and Takealot. It combines a React/Vite‑based frontend with an Express/Puppeteer backend, and is distributed as a single Docker container for streamlined deployment.

Please note this web application scrapes off Takealot and Amazon and is only mean to be used for educational purposes.

---

## Deployment

This application is fully deployable. Ensure that your environment variables are correctly configured for production.

It is live on at https://comparing-price-website.onrender.com/

Note: The website will spin down with inactivity, which can delay requests by 50 seconds or more. As well as the results may not always be accurate. 

---

## Key Features

- **Real‑Time Price Comparison**  
  Fetches and displays the top three results for any query on Amazon South Africa and Takealot.  
- **Resilient Web Scraping**  
  Uses Puppeteer Extra with stealth plugins, randomized user agents, resource blocking, retry logic, and exponential backoff to minimize detection and intermittent failures.  
- **Single‑Container Deployment**  
  Frontend and backend bundled in one Docker image, serving a production build of React from Express.  
- **Responsive UI**  
  Mobile‑friendly navigation and layout built with Tailwind CSS.  

---

## Architecture & Technology

| Layer        | Framework / Library            |
|--------------|--------------------------------|
| Frontend     | React · Vite · Tailwind CSS    |
| Backend      | Node.js · Express · Puppeteer  |
| Scraping     | `puppeteer-extra` · Stealth    |
| Container    | Docker (Node 20‑slim)          |
| Deployment   | Render.com                     |

---
