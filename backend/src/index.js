require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const architectRoutes = require('./routes/architect');
const reviewerRoutes = require('./routes/reviewer');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/architect', architectRoutes);
app.use('/api/reviewer', reviewerRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'SprintAgent AI' }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SprintAgent] Backend running on http://localhost:${PORT}`);
});
