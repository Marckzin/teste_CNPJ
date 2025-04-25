const fs = require('fs');
const pdf = require('pdf-parse');

const buffer = fs.readFileSync('Cartão_CNPJ.pdf');

pdf(buffer)
    .then(function (data) {
        const texto = data.text;
        console.log(texto); // Só para ver a estrutura (depois pode apagar)

        const cnpj = texto.match(/NÚMERO DE INSCRIÇÃO\s+([0-9./-]+)/);
        const dataAbertura = texto.match(/DATA DE ABERTURA\s+([\d/]+)/);
        const nomeEmpresarial = texto.match(/NOME EMPRESARIAL\s+(.+)/);
        const fantasia = texto.match(/TÍTULO DO ESTABELECIMENTO.*\s+(.+)/);
        const porte = texto.match(/PORTE\s+(.+)/);

        if (cnpj) console.log("CNPJ:", cnpj[1]);
        if (dataAbertura) console.log("Data de Abertura:", dataAbertura[1]);
        if (nomeEmpresarial) console.log("Nome Empresarial:", nomeEmpresarial[1]);
        if (fantasia) console.log("Nome Fantasia:", fantasia[1]);
        if (porte) console.log("Porte:", porte[1]);
    })
    .catch(function (error) {
        console.error("Erro ao processar o PDF:", error.message);
    });
