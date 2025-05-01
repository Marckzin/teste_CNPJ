// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdf = require('pdf-parse');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const caminhoArquivo = req.file.path;
    const buffer = fs.readFileSync(caminhoArquivo);
    const data = await pdf(buffer);
    const texto = data.text;

    const cnpj = texto.match(/NÚMERO DE INSCRIÇÃO\s+([0-9./-]+)/);
    const dataAbertura = texto.match(/DATA DE ABERTURA\s+([\d/]+)/);
    const nomeEmpresarial = texto.match(/NOME EMPRESARIAL\s+(.+)/);
    const fantasia = texto.match(/TÍTULO DO ESTABELECIMENTO.*\s+(.+)/);
    const porte = texto.match(/PORTE\s+(.+)/);

    res.json({
      cnpj: cnpj ? cnpj[1] : null,
      dataAbertura: dataAbertura ? dataAbertura[1] : null,
      nomeEmpresarial: nomeEmpresarial ? nomeEmpresarial[1] : null,
      fantasia: fantasia ? fantasia[1] : null,
      porte: porte ? porte[1] : null,
    });

    fs.unlinkSync(caminhoArquivo); // Apaga o PDF após uso
  } catch (err) {
    console.error("Erro ao processar o PDF:", err.message);
    res.status(500).json({ error: "Erro ao processar o PDF" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
