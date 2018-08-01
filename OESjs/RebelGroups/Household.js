/*******************************************************************************
 * The Household object class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Household = new cLASS( {
  Name: "Household",
  supertypeName: "oBJECT",
  properties: {
    "money": {
      range: "PositiveDecimal",
      label: "Money"
    },
    "reachableEnterprises": {
      range: "Enterprise",
      minCard: 0,
      maxCard: Infinity
    },
    "preferredEnterprises": {
      range: "Entreprise",
      minCard: 0,
      maxCard: Infinity
    }
  }
} );
