/*******************************************************************************
 * Purchase event class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Purchase = new cLASS( {
  Name: "Purchase",
  shortLabel: "Purch",
  supertypeName: "eVENT",
  properties: {
    "household": {range: "Household"},
    "enterprise": {range: "Enterprise"},
    "requestedQuantity": {range: "NonNegativeInteger"}
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var satisfaction = false;
      
      if ( this.enterprise.inventoryLevel >= this.requestedQuantity ) {
        
        this.enterprise.wealth += this.enterprise.productPrice *
            this.requestedQuantity;
        
        this.entrepreneur.profit += (this.enterprise.productPrice -
            this.enterprise.productionCost) * this.requestedQuantity;
        
        this.enterprise.inventoryLevel -= this.requestedQuantity;
        
        // Update statistics on Products Purchased
        sim.stat.productsPurchased += this.requestedQuantity;
        
        satisfaction = true;
      } else {
        
     // Update statistics on Purchases Request Missed
        sim.stat.purchaseRequestsMissed += this.quantity;
      }
      
      /* Update Entrepreneur's appraisal
      followupEvents.push( new AppraiseTransaction( {
        occTime: this.occTime + 1,
        customer: this.customer,
        entrepreneur: this.entrepreneur,
        satisfaction: satisfaction
      } ) ); */
      
      // Update statistics on Products Requested
      sim.stat.productsRequested += this.requestedQuantity;
      
      return followupEvents;
    },
    "createNextEvent": function () {
      return new Purchase({
        occTime: this.occTime + Purchase.recurrence(),
        household: this.household,
        enterprise: this.enterprise,
        requestedQuantity: 7
      });
    }
  }
});
// Any exogenous event type needs to define a static function "recurrence"
Purchase.recurrence = function () {
  return rand.uniformInt( 1, 4);  // between 1 and 4 days
};
