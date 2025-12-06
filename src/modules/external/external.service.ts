import axios from "axios";
import { ApiError } from "../../utils/ApiError";
import { ExternalProductDTO } from "./external.dto";

export async function fetchExternalProducts(limit: number = 5): Promise<ExternalProductDTO[]> {
  try {
    const response = await axios.get(`https://fakestoreapi.com/products?limit=${limit}`);

    if (response.status !== 200) {
      throw new ApiError(502, "External API returned non-200 status");
    }

    return response.data.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: product.price,
    }));
  } catch (err: any) {
    if (err.response) {
      throw new ApiError(502, `External API error: ${err.response.statusText}`, err.response.data);
    }

    throw new ApiError(502, "Failed to fetch external API", err.message);
  }
}
