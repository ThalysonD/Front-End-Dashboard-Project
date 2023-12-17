import axios from "axios";

const API_URL = "https://gestao-app-08b3423b86e1.herokuapp.com/planner/auth";

const login = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      senha,
    });

    const { token } = response.data;
    return token;
  } catch (error) {
    const status = error.response.status;
    if (status === 400) {
      // O servidor respondeu com um status de erro (400 Bad Request)
      console.error("Erro na solicitação:", error.response.data);

      if (status === 401) {
        // Tratamento para status 401 (Unauthorized)
        console.error("Credenciais inválidas. Por favor, tente novamente.");
      } else if (status === 403) {
        // Tratamento para status 403 (Forbidden)
        console.error("Acesso proibido. Verifique suas permissões.");
      }
    } else if (status === 404) {
      throw new Error("Recurso não encontrado. Verifique a URL.");
    } else if (error.request) {
      // A solicitação foi feita, mas não recebeu resposta
      console.error("Sem resposta do servidor:", error.request);
    } else {
      // Algo aconteceu na configuração da solicitação que gerou um erro
      console.error("Erro ao configurar a solicitação:", error.message);
    }
    throw error;
  }
};

export { login };
