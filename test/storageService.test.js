const test = require("ava");
const storageService = require("../src/services/storageService");
const fs = require("fs");
const logger = require("../src/utils/logger"); // Assuming you have a logger setup

test.beforeEach(() => {

  logger.info("[storageService.test] Running beforeEach hook...");

  const filePath = "./test/testData.csv";
  const header = fs.readFileSync(filePath, "utf8").split("\n")[0];
  fs.truncateSync(filePath, 0);
  fs.appendFileSync(filePath, header + "\n");
});

// ... rest of your tests

test("writeDataWithDuplicationCheck prevents duplicate data", async (t) => {
  // Arrange
  const filePath = "./test/testData.csv";
  const newData = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ];
  const fieldNames = ["id", "name"];
  const uniqueFields = ["id"];

  // Act
  await storageService.writeDataWithDuplicationCheck(
    filePath,
    newData,
    fieldNames,
    uniqueFields
  );
  await storageService.writeDataWithDuplicationCheck(
    filePath,
    newData,
    fieldNames,
    uniqueFields
  );

  // Assert
  const data = await storageService.loadData(filePath);
  t.is(data.length, 2);
});
