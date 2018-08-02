/*******************************************************************************
 * The Enterprise object class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Enterprise = new cLASS( {
  Name: "Enterprise",
  supertypeName: "oBJECT",
  properties: {
    "rebelgroup": {
      range: "RebelGroup",
      label: "Rebel Group Association"
    },
    "wealth": {
      range: "Decimal",
      label: "Liquidity"
    },
    "accIncome": {
      range: "Decimal",
      label: "Accumulated Income"
    },
    "meanIncome": {
      range: "Decimal",
      label: "Income Mean"
    },
    "stdDevIncome": {
      range: "Decimal",
      label: "Income Standard Deviation"
    }
  }
} );