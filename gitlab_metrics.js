require("dotenv").config();
const axios = require("axios");

const GITLAB_URL = "https://gitlab.fretebras.com.br/api/v4";
const TOKEN = process.env.GITLAB_TOKEN;
const USER_ID = process.env.USER_ID;
const headers = { "PRIVATE-TOKEN": TOKEN };

const START_DATE = "2025-03-01"; // Data inicial (AAAA-MM-DD)
const END_DATE = "2025-03-31"; // Data final (AAAA-MM-DD)



// Função para obter todos os projetos onde o usuário contribuiu
async function getProjects() {
    try {
        const url = `${GITLAB_URL}/projects?per_page=1000`;

        const response = await axios.get(url, { headers });

        if (!Array.isArray(response.data)) {
            throw new Error("Resposta inesperada da API do GitLab. Verifique as credenciais e permissões.");
        }

        return response.data.map(project => project.id);
    } catch (error) {
        console.error("Erro ao buscar projetos:", error.response?.data || error.message);
        return [];
    }
}

// Função para contar commits em um projeto
async function getCommits(projectId) {
    try {
        const url = `${GITLAB_URL}/projects/${projectId}/repository/commits?author_id=${USER_ID}&since=${START_DATE}T00:00:00Z&until=${END_DATE}T23:59:59Z`;
        const { data } = await axios.get(url, { headers });
        return data.length;
    } catch (error) {
        return 0;
    }
}

// Função para contar Merge Requests criadas
async function getMergeRequests(projectId) {
    try {
        //const url = `${GITLAB_URL}/projects/${projectId}/merge_requests?author_id=${USER_ID}&updated_after=${START_DATE}&updated_before=${END_DATE}`;
        const url = `${GITLAB_URL}/projects/${projectId}/merge_requests?author_id=${USER_ID}`;
        const { data } = await axios.get(url, { headers });
        return data.length;
    } catch (error) {
        return 0;
    }
}

// Função para contar Merge Requests revisadas
async function getReviewedMergeRequests(projectId) {
    try {
        //const url = `${GITLAB_URL}/projects/${projectId}/merge_requests?reviewer_id=${USER_ID}&reviewed_after=${START_DATE}&reviewed_before=${END_DATE}`;
        const url = `${GITLAB_URL}/projects/${projectId}/merge_requests?reviewer_id=${USER_ID}`;
        const { data } = await axios.get(url, { headers });
        return data.length;
    } catch (error) {
        return 0;
    }
}

// Função para coletar estatísticas de código
async function getCommitStats(projectId) {
    try {
        const url = `${GITLAB_URL}/projects/${projectId}/repository/commits?since=${START_DATE}T00:00:00Z&until=${END_DATE}T23:59:59Z`;
        const { data: commits } = await axios.get(url, { headers });

        let additions = 0, deletions = 0;
        for (const commit of commits) {
            const commitUrl = `${GITLAB_URL}/projects/${projectId}/repository/commits/${commit.id}`;
            const { data: commitData } = await axios.get(commitUrl, { headers });
            additions += commitData.stats?.additions || 0;
            deletions += commitData.stats?.deletions || 0;
        }
        return { additions, deletions };
    } catch (error) {
        return { additions: 0, deletions: 0 };
    }
}

// Função principal para agregar os dados de todos os projetos
async function main() {
    console.log(`🔍 Buscando métricas do usuário ${USER_ID} GitLab para todos os projetos...`);

    const projects = await getProjects();
    if (projects.length === 0) {
        console.log("❌ Nenhum projeto encontrado.");
        return;
    }

    let totalCommits = 0;
    let totalMRs = 0;
    let totalReviewedMRs = 0;
    let totalAdditions = 0;
    let totalDeletions = 0;

    // Processa todos os projetos simultaneamente
    await Promise.all(projects.map(async (projectId) => {
        const [commits, mergeRequests, reviewedMRs, { additions, deletions }] = await Promise.all([
            getCommits(projectId),
            getMergeRequests(projectId),
            getReviewedMergeRequests(projectId),
            getCommitStats(projectId)
        ]);

        totalCommits += commits;
        totalMRs += mergeRequests;
        totalReviewedMRs += reviewedMRs;
        totalAdditions += additions;
        totalDeletions += deletions;
    }));

    console.log("\n📊 Relatório de Performance (Todos os Projetos):");
    console.log(`✅ Commits realizados: ${totalCommits}`);
    console.log(`✅ Merge Requests criadas: ${totalMRs}`);
    console.log(`✅ Merge Requests revisadas: ${totalReviewedMRs}`);
    console.log(`✅ Linhas de código adicionadas: ${totalAdditions}`);
    console.log(`✅ Linhas de código removidas: ${totalDeletions}`);
}

// Executa o script
main();
