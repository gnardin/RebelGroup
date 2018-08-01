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
    }
  }
} );


print more than expected