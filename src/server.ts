import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'express-async-errors';
import Joi from 'joi';

dotenv.config();

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: 'Earth',
  },
  {
    id: 2,
    name: 'Mars',
  },
];

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const planetChart = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

const planetValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { error } = planetChart.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

app.get('/api/planets', (req, res) => {
  res.json(planets);
});

app.get('/api/planets/:id', (req, res) => {
  const planetId = parseInt(req.params.id, 10);
  const planet = planets.find((p) => p.id === planetId);
  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }
  res.json(planet);
});

app.post('/api/planets', planetValidation, (req, res) => {
  const newPlanet: Planet = req.body;
  planets.push(newPlanet);
  res.status(201).json({ msg: 'Planet created successfully' });
});

app.put('/api/planets/:id', planetValidation, (req, res) => {
  const planetId = parseInt(req.params.id, 10);
  const planetIndex = planets.findIndex((p) => p.id === planetId);
  if (planetIndex === -1) {
    return res.status(404).json({ error: 'Planet not found' });
  }
  planets[planetIndex] = req.body;
  res.json({ msg: 'Planet updated successfully' });
});

app.delete('/api/planets/:id', (req, res) => {
  const planetId = req.params.id;
  planets = planets.filter((planet) => String(planet.id) !== planetId);
  res.json({ msg: 'Planet deleted successfully' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});