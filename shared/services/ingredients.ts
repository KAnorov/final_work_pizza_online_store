
import { ApiRoutes } from "./constants";
import { Ingredient } from "@prisma/client";
import { axiosInstance } from "./instance";

export const getAll = async (): Promise<Ingredient[]> => {
    return (await axiosInstance.get<Ingredient[]>(ApiRoutes.INGREDIENTS)).data;
  };
