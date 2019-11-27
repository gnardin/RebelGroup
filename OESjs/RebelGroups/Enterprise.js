/*******************************************************************************
 * Enterprise object class
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
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
    "wealth": {
      range: "Decimal",
      label: "Liquidity"
    },
    "rebelGroup": {
      range: "RebelGroup",
      label: "Main Rebel Group"
    },
    "income": {
      range: "Decimal",
      label: "Income"
    },
    "freqIncome": {
      range: "NonNegativeInteger",
      label: "Frequency of Income"
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
    "nmrOfLootings": {
      range: "NonNegativeInteger",
      label: "Number of Loot"
    }
  },
  methods: {}
} );