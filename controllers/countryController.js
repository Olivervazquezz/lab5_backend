const pool = require('../db');

// Obtener todos los países
exports.getAllCountries = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM country ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los países:', error);
    res.status(500).json({ error: 'Error al obtener los países' });
  }
};

// Obtener un país por ID
exports.getCountryById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM country WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'País no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el país:', error);
    res.status(500).json({ error: 'Error al obtener el país' });
  }
};

// Crear un nuevo país
exports.createCountry = async (req, res) => {
  const { name, capital, currency } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'El nombre del país es obligatorio' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO country (name, capital, currency) VALUES (?, ?, ?)',
      [name, capital, currency]
    );
    const [newCountry] = await pool.query('SELECT * FROM country WHERE id = ?', [result.insertId]);
    res.status(201).json(newCountry[0]);
  } catch (error) {
    console.error('Error al crear el país:', error);
    res.status(500).json({ error: 'Error al crear el país' });
  }
};

// Actualizar un país existente
exports.updateCountry = async (req, res) => {
  const { name, capital, currency } = req.body;
  const countryId = req.params.id;
  if (!name) {
    return res.status(400).json({ error: 'El nombre del país es obligatorio' });
  }
  try {
    const [check] = await pool.query('SELECT * FROM country WHERE id = ?', [countryId]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'País no encontrado' });
    }
    await pool.query(
      'UPDATE country SET name = ?, capital = ?, currency = ? WHERE id = ?',
      [name, capital, currency, countryId]
    );
    const [updated] = await pool.query('SELECT * FROM country WHERE id = ?', [countryId]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar el país:', error);
    res.status(500).json({ error: 'Error al actualizar el país' });
  }
};

// Eliminar un país
exports.deleteCountry = async (req, res) => {
  const countryId = req.params.id;
  try {
    const [check] = await pool.query('SELECT * FROM country WHERE id = ?', [countryId]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'País no encontrado' });
    }
    await pool.query('DELETE FROM country WHERE id = ?', [countryId]);
    res.json({ message: 'País eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el país:', error);
    res.status(500).json({ error: 'Error al eliminar el país' });
  }
};