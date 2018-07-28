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
    "wealth": {
      range: "Decimal",
      label: "Liquidity"
    },
    "profit": {
      range: "Decimal",
      label: "Last Pizzo Request Liquidity"
    },
    "inventoryLevel": {
      range: "NonNegativeInteger",
      label: "Products Inventory Level"
    },
    "productPrice": {
      range: "Decimal",
      label: "Product Price"
    },
    "numExtortionRequest": {
      range: "NonNegativeInteger",
      label: "Number Extorion Requests"
    },
    "numExtortionRep": {
      range: "NonNegativeInteger",
      label: "Number Pizzo Reports"
    },
    "numEffectiveRep": {
      range: "NonNegativeInteger",
      label: "Number Effective Reports"
    },
    "numPunishment": {
      range: "NonNegativeInteger",
      label: "Number Punishments"
    },
    "numPunishRep": {
      range: "NonNegativeInteger",
      label: "Number Punishment Reports"
    },
    "destroyedProducts": {
      range: "NonNegativeInteger",
      label: "Destroyed Products"
    }
  }
} );
