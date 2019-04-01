/*******************************************************************************
 * The Rebel Group object class
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var RebelGroup = new cLASS( {
  Name: "RebelGroup",
  supertypeName: "oBJECT",
  properties: {
    "wealth": {
      range: "Decimal",
      label: "Wealth"
    },
    "nmrOfRebels": {
      range: "NonNegativeInteger",
      label: "Number Rebels"
    },
    "rebelCost": {
      range: "Decimal",
      label: "Rebel's cost"
    },
    "recruitThreshold": {
      range: "Decimal",
      label: "Recruitment Strength Threshold"
    },
    "recruitRate": {
      range: "Decimal",
      label: "Maximum Recruitment Rate"
    },
    "extortedEnterprises": {
      range: "Enterprise",
      label: "Extorted Enterprises",
      minCard: 0,
      maxCard: Infinity
    },
    "extortionRate": {
      range: "Decimal",
      label: "Extortion Rate"
    },
    "reports": {
      range: "Object",
      label: "Number of Reports other Rebel Groups"
    },
    "freqDemand": {
      range: "NonNegativeInteger",
      label: "Frequency to Demand"
    },
    "freqExpand": {
      range: "NonNegativeInteger",
      label: "Frequency to Expand"
    },
    "freqAllocate": {
      range: "NonNegativeInteger",
      label: "Frequency to Allocate Resource"
    },
    "lastExpand": {
      range: "NonNegativeInteger",
      label: "Time Last Expansion"
    },
    "lastAmountCollected": {
      range: "Decimal",
      label: "Amount Collected Last Period"
    }
  },
  methods: {}
} );