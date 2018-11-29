const dataForge = require("data-forge");
require("data-forge-fs");

let df = dataForge
  .readFileSync("originalJSON.json")
  .parseJSON()
  .dropSeries([
    "drug_tier",
    "rxnorm_id",
    "plan_id",
    "prior_authorization",
    "plan_id_type",
    "quantity_limit",
    "_formulary_url",
    "_index_url",
    "step_therapy"
  ])
  .renameSeries({
    drug_name: "value"
  })
  .withSeries("label", df => df.select(row => row.value))
  .asJSON()
  .writeFileSync("editedJSON.json");