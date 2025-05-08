import { db } from "./db.connection.js";
import { cepTable } from "../../models/cep.model.js";
import { v4 as uuid } from "uuid";
import { CepRepository } from "../../repositories/cep.repository.js";
import { CepService } from "../../services/cep.service.js";

/**
 * Função principal que realiza o seed do banco de dados com CEPs
 * de Porto Alegre contendo "Domingos" no logradouro
 */
async function seed() {
  try {
    console.log("Iniciando seed do banco de dados...");
    
    // Instancia o repositório e o serviço de CEP
    const cepRepository = new CepRepository();
    const cepService = new CepService(cepRepository);
    
    // Busca CEPs de Porto Alegre com "Domingos" no logradouro
    const response = await fetch("https://viacep.com.br/ws/RS/Porto%20Alegre/Domingos/json/");
    if (!response.ok) {
      throw new Error(`Erro ao buscar CEPs: ${response.status} ${response.statusText}`);
    }
    
    const ceps = await response.json();
    console.log(`Encontrados ${ceps.length} CEPs para inserção`);
    
    // Contadores para log
    let inserted = 0;
    let skipped = 0;
    
    // Processa e insere cada CEP
    for (const cepData of ceps) {
      try {
        // Formata o CEP para o padrão esperado (com hífen)
        const formattedCep = cepData.cep;
        
        // Verifica se o CEP já existe no banco
        try {
          // Tenta buscar o CEP pelo serviço - se existir, ele retornará o CEP existente
          const existingCep = await cepRepository.getCepByCep(formattedCep);
          
          if (existingCep) {
            console.log(`CEP ${formattedCep} já existe no banco, pulando...`);
            skipped++;
            continue;
          }
          
          // Prepara os dados para inserção usando o serviço
          await cepService.getCepByCep(formattedCep);
          console.log(`CEP ${formattedCep} inserido com sucesso`);
          inserted++;
        } catch (error) {
          if (error instanceof Error && error.message === 'cep-not-found') {
            console.error(`CEP ${formattedCep} não encontrado na API ViaCEP`);
          } else {
            // Prepara os dados para inserção manual caso o serviço falhe por algum motivo
            const cepRecord = {
              id: uuid(),
              favorito: false,
              cep: cepData.cep,
              logradouro: cepData.logradouro,
              complemento: cepData.complemento || null,
              unidade: cepData.unidade || null,
              bairro: cepData.bairro,
              localidade: cepData.localidade,
              uf: cepData.uf,
              estado: cepData.estado || '',
              regiao: cepData.uf,
              ibge: cepData.ibge || null,
              gia: cepData.gia || null,
              ddd: cepData.ddd || null,
              siafi: cepData.siafi || null,
            };
            
            // Insere o CEP no banco usando o repositório diretamente como fallback
            await cepRepository.createCep(formattedCep, cepRecord);
            console.log(`CEP ${formattedCep} inserido manualmente com sucesso`);
            inserted++;
          }
        }
      } catch (error) {
        console.error(`Erro ao inserir CEP ${cepData.cep}:`, error);
      }
    }
    
    console.log(`Seed concluído! ${inserted} CEPs inseridos, ${skipped} CEPs ignorados.`);
  } catch (error) {
    console.error("Erro ao executar seed:", error);
  } finally {
    // Encerra a conexão com o banco
    process.exit(0);
  }
}

// Executa o seed
seed();