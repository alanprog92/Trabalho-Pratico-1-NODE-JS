import express from "express";
import { finalResponseFormatter, mesmaQuatidadeDeModelos, sortMaisModelos, sortMenosModelos } from "./utils.js";

const marcas = express.Router();

marcas.get("/maisModelos", async (_, res) => {
  try {
    const sortedCarListMais = await sortMaisModelos();
    const filtedCarList = await mesmaQuatidadeDeModelos(sortedCarListMais[0]);
    const finalResponse = finalResponseFormatter(filtedCarList);

    res.status(200).send(finalResponse);
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

marcas.get("/menosModelos", async (_, res) => {
  try {
    const sortedCarListMenos = await sortMenosModelos();
    const filtedCarList = await mesmaQuatidadeDeModelos(sortedCarListMenos[0]);
    const finalResponse = finalResponseFormatter(filtedCarList);

    res.status(200).send(finalResponse);
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

marcas.get("/listaMaisModelos/:value", async (req, res) => {
  try {
    const sortedCarListaMaisModelos = await sortMaisModelos();
    const finalResponseFormatted = sortedCarListaMaisModelos
      .slice(0, parseInt(req.params.value))
      .map((detail) => `${detail.brand} - ${detail.models.length}`);

    res.status(200).send(finalResponseFormatted);
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

marcas.get("/listaMenosModelos/:value", async (req, res) => {
  try {
    const sortedCarListaMenosModelos = await sortMenosModelos();
    const finalResponseFormatted = sortedCarListaMenosModelos
      .slice(0, parseInt(req.params.value))
      .map((detail) => `${detail.brand} - ${detail.models.length}`);

    res.status(200).send(finalResponseFormatted);
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

marcas.post("/listaModelos", async (req, res) => {
  try {
    if (!req.body.hasOwnProperty("nomeMarca")) {
      throw new Error("Label 'nomeMarca' é mandatório!");
    }
    if (req.body.nomeMarca === "") {
      throw new Error("Forneça um valor!");
    }

    const carList = JSON.parse(await readFile(global.filePath));

    const finalCarList =
      carList.find(
        ({ brand }) => brand.toLowerCase() === req.body.nomeMarca.toLowerCase()
      )?.models ?? [];

    res.status(200).send(finalCarList);
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

export default marcas;
