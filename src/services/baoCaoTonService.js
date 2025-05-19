import axios from "axios";

const BASE_URL = "http://localhost:8080/api/baocaoton";

const baoCaoTonService = {
  getBaoCaoTon: async (month, year) => {
    try {
      const response = await axios.get(`${BASE_URL}/${month}/${year}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bao cao ton:", error);
      throw error;
    }
  },
};

export default baoCaoTonService;
