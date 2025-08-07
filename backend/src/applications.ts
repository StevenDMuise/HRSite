import { Router } from 'express';

const router = Router();

// In-memory store for MVP
let applications: any[] = [];
let idCounter = 1;

// List all applications
router.get('/', (_req, res) => {
  res.json(applications);
});

// Create new application
router.post('/', (req, res) => {
  const app = { id: idCounter++, ...req.body, createdAt: new Date().toISOString() };
  applications.push(app);
  res.status(201).json(app);
});

// Get application by ID
router.get('/:id', (req, res) => {
  const app = applications.find(a => a.id === Number(req.params.id));
  if (!app) return res.status(404).json({ error: 'Not found' });
  res.json(app);
});

// Update application
router.put('/:id', (req, res) => {
  const idx = applications.findIndex(a => a.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  applications[idx] = { ...applications[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(applications[idx]);
});

// Archive/Delete application
router.delete('/:id', (req, res) => {
  const idx = applications.findIndex(a => a.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const [removed] = applications.splice(idx, 1);
  res.json({ archived: removed });
});

export default router;
