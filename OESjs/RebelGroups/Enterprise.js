/*******************************************************************************
 * Enterprise object class
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
    "income": {
      range: "Object",
      label: "Income"
    },
    "freqIncome": {
      range: "Object",
      label: "Frequency of Income"
    },
    "rebelGroup": {
      range: "RebelGroup",
      label: "Main Rebel Group"
    },
    "wealth": {
      range: "Decimal",
      label: "Liquidity"
    },
    "accIncome": {
      range: "Decimal",
      label: "Accumulated Income"
    },
    "fleeProb": {
      range: "Decimal",
      label: "Probability to Flee"
    },
    "fleeThreshold": {
      range: "NonNegativeInteger",
      label: "Number of Loot to Flee"
    },
    "nmrOfExtortions": {
      range: "NonNegativeInteger",
      label: "Number of Extortions"
    },
    "nmrOfLoot": {
      range: "NonNegativeInteger",
      label: "Number of Loot"
    }
  },
  methods: {}
} );