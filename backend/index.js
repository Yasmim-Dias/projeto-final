import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// NO LOCAL: coloque aqui sua URL e KEY do Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qubzthpjvrbbqarlkydt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaXlrdWx6bWV1dnN2eGtyZGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzg4MzcsImV4cCI6MjA3ODYxNDgzN30.EIwt0Pvn94P2htQwiMWnWtd6TnH7fZR0Q3v3Li9Ah_w';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Rota de teste de conexão
app.get('/teste-conexao', async (req, res) =>{
  const { data, error } = await supabase.from('usuarios').select('*').limit(10);
  if(error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

// Criar usuário
app.post('/usuarios', async (req, res) =>{
  try{
    const { nome, telefone, email, endereco } = req.body;
    if(!nome || !telefone || !email || !endereco)
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });

    const { data, error } = await supabase.from('usuarios')
      .insert([{ nome, telefone, email, endereco }]).select().single();

    if(error) throw error;
    res.status(201).json(data);
  }catch(err){
    res.status(500).json({ erro: err.message });
  }
});

// Criar cartão
app.post('/cartoes', async (req, res) =>{
  try{
    const { numero, validade, cvv, id_usuario } = req.body;
    if(!numero || !validade || !cvv || !id_usuario)
      return res.status(400).json({ erro: 'Todos os campos do cartão são obrigatórios.' });

    const { data, error } = await supabase.from('cartoes')
      .insert([{ numero, validade, cvv, id_usuario }]).select().single();

    if(error) throw error;
    res.status(201).json(data);
  }catch(err){
    res.status(500).json({ erro: err.message });
  }
});

// GET usuários com join de cartões
app.get('/usuarios-com-cartoes', async (req, res) =>{
  try{
    const { data, error } = await supabase
      .from('usuarios')
      .select(`id, nome, telefone, email, endereco, cartoes ( id, numero, validade )`);

    if(error) throw error;
    res.json(data);
  }catch(err){
    res.status(500).json({ erro: err.message });
  }
});

// DELETE usuário (remove também cartões por FK ON DELETE CASCADE se configurado no Supabase)
app.delete('/usuarios/:id', async (req, res) =>{
  try{
    const id = Number(req.params.id);
    if(!id) return res.status(400).json({ erro: 'ID inválido.' });

    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if(error) throw error;
    res.status(204).end();
  }catch(err){
    res.status(500).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`API rodando na porta ${PORT}`));