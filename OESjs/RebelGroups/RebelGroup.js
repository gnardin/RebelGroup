/*******************************************************************************
 * The Rebel Group object class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
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
      label: "Cost of a Rebel"
    },
    "extortedEnterprises": {
      range: "Enterprise",
      minCard: 0,
      maxCard: Infinity
    },
    "extortionRate": {
      range: "Decimal",
      label: "Extortion Rate"
    },
    "freqDemand": {
      range: "Object",
      label: "Frequency to Demand"
    },
    "freqExpand": {
      range: "Object",
      label: "Frequency to Expand"
    },
    "freqAllocate": {
      range: "Object",
      label: "Frequency to Allocate Resource"
    },
    "lastExpand": {
      range: "NonNegativeInteger",
      label: "Time Last Expansion"
    },
    "lastWealth": {
      range: "Decimal",
      label: "Wealth Last Adaptation"
    },
    "reports": {
      range: "Object",
      label: "Number of Reports other Rebel Groups"
    }
  },
  methods: {
  }
} );