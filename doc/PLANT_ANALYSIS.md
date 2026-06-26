## Plant Disease Analysis API

Base path: `/api/plant-analysis`

Authentication: Bearer token required for all endpoints.

1. Upload & Analyze

POST `/api/plant-analysis`

Form-data:

- `image`: file (jpg, jpeg, png, webp) max 5MB

Response 201:

```
{
  "success": true,
  "message": "Analisis berhasil",
  "data": { ... newly created record ... }
}
```

2. Get All Analysis

GET `/api/plant-analysis?page=1&limit=10&search=&disease=&severity=`

Response 200 (paginated): includes `pagination` object.

3. Get Detail

GET `/api/plant-analysis/:id`

4. Update

PUT `/api/plant-analysis/:id`

Body (JSON) allowed fields: `plant_name`, `disease_name`, `confidence`, `severity`, `symptoms`, `causes`, `treatment`, `prevention`.

5. Delete

DELETE `/api/plant-analysis/:id`

Notes:

- Uploaded images are saved under `public/uploads/plant-analysis` and served via static middleware.
- Set `GEMINI_API_KEY` and `GEMINI_API_URL` (or `GEMINI_ENDPOINT`) environment variables to enable image analysis.
- The raw Gemini response is stored in `ai_response` field.
