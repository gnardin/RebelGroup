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
    "nmrOfRebels": {
      range: "NonNegativeInteger",
      label: "Number Rebels"
    },
    "wealth": {
      range: "Decimal",
      label: "Wealth"
    },
    "extortionRate": {
      range: "Decimal",
      label: "Extortion Rate"
    },
    "lastExpansion": {
      range: "NonNegativeInteger",
      label: "Last Expansion"
    },
    "enterprises": {
      range: "Enterprise",
      minCard: 0,
      maxCard: Infinity
    }
  },
  
  methods: {
  }
} );
