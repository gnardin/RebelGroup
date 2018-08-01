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
    "nrmOfRebels": {
      range: "NonNegativeInteger",
      label: "Number Rebels"
    },
    "wealth": {
      range: "Decimal",
      label: "Wealth"
    }
  },
  
  methods: {
  }
} );
