const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

router.get("/", (_req, res) => {
  const inventoryList = JSON.parse(fs.readFileSync("./data/inventories.json"));
  res.json(
    inventoryList.map((inventory) => {
      return {
        id: inventory.id,
        warehouseID: inventory.warehouseID,
        warehouseName: inventory.warehouseName,
        itemName: inventory.itemName,
        description: inventory.description,
        category: inventory.category,
        status: inventory.status,
        quantity: inventory.quantity,
      };
    })
  );
});

router.post("/", (req, res) => {
  const {
    itemName,
    description,
    category,
    status,
    quantity,
    warehouseID,
    warehouseName,
  } = req.body;

  if (
    !itemName ||
    !description ||
    !category ||
    !status ||
    quantity === undefined ||
    !warehouseID ||
    !warehouseName
  ) {
    return res
      .status(400)
      .send("Error! One or more of the required request fields are empty");
  } else if (Number(quantity) !== JSON.parse(quantity)) {
    return res.status(400).send("Error! Quantity field sent invaild data type");
  } else if (status !== "In Stock" && status !== "Out of Stock") {
    return res.status(400).send("Error! Status field sent invalid data");
  } else {
    const newItem = {
      id: uuidv4(),
      warehouseID,
      warehouseName,
      itemName,
      description,
      category,
      status,
      quantity,
    };
    const oldInventoryList = JSON.parse(
      fs.readFileSync("data/inventories.json")
    );
    let newInventoryList = [...oldInventoryList, newItem];
    fs.writeFileSync("data/inventories.json", JSON.stringify(newInventoryList));
    res.status(201).send(newItem.id);
  }
});

module.exports = router;

router.get("/:inventoryId", (req, res) => {
  const inventoriesData = JSON.parse(fs.readFileSync("data/inventories.json"));

  const selectedInventory = inventoriesData.find(
    (inventory) => inventory.id === req.params.inventoryId
  );

  if (!selectedInventory) {
    return res.status(404).send("Inventory item not found");
  }

  res.json(selectedInventory);
});

module.exports = router;
