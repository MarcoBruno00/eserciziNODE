import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'express-async-errors';
import Joi from 'joi';
import {getAll , getOneById ,create ,updateById , deleteById} from "./controllers/planets.js"

dotenv.config();

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

app.get('/api/planets', getAll);

app.get('/api/planets/:id', getOneById);

app.post('/api/planets', planetValidation, create);

app.put('/api/planets/:id', planetValidation, updateById );

app.delete('/api/planets/:id', deleteById);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});