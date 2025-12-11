const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  'https://yhiykulzmeuvsvxkrdkj.supabase.co';

const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaXlrdWx6bWV1dnN2eGtyZGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzg4MzcsImV4cCI6MjA3ODYxNDgzN30.EIwt0Pvn94P2htQwiMWnWtd6TnH7fZR0Q3v3Li9Ah_w';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Rotas ---

app.get('/teste-conexao', async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

app.post('/usuarios', async (req, res) => {
  const { nome, telefone, email, endereco } = req.body;
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome, telefone, email, endereco }])
    .select()
    .single();
  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(data);
});

app.post('/cartoes', async (req, res) => {
  const { numero, validade, cvv, id_usuario } = req.body;
  const { data, error } = await supabase
    .from('cartoes')
    .insert([{ numero, validade, cvv, id_usuario }])
    .select()
    .single();
  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(data);
});

app.get('/usuarios-com-cartoes', async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nome,
      telefone,
      email,
      endereco,
      cartoes ( id, numero, validade )
    `);
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

app.delete('/usuarios/:id', async (req, res) => {
  const { error } = await supabase.from('usuarios').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ erro: error.message });
  res.status(204).end();
});

module.exports = app;
