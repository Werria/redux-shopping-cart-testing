import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithContext } from "../../test-utils";
import { Products } from "./Products";
import * as api from "../../app/api";
import mockProducts from "../../../public/products.json";

const getProductsSpy = jest.spyOn(api, "getProducts");
getProductsSpy.mockResolvedValue(mockProducts);

test("severel produtcs should be listed", async () => {
  const { debug } = renderWithContext(<Products />);
  // debug();
  await waitFor(() => expect(getProductsSpy).toHaveBeenCalledTimes(1));
  // debug();
  const articles = screen.getAllByRole("article");
  expect(articles.length).toEqual(mockProducts.length);
});
