/*******************************************************************************
 * ReminderExpansion event class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var ReminderExpansion = new cLASS({
  Name: "ReminderExpansion",
  supertypeName: "eVENT",
  properties: {
    "rebelgroup": {
      range: "RebelGroup"
    }
  },
  methods: {
    "onEvent": function () {
      // Decision to fight is a combination between the 
      // logistic based on time and power ratio difference
      
      // Use logistic function to calculate the probability
      var expandProb = 0;
      
      if ( rand.uniform() < expandProb ) {
        // Choose one Enterprise outside your domain
        // based on the wealth ratio. The poorest ones
        // have a greater chance to be extorted/looted
        
        // Weaker rebel group loots and stronger one extorts
        // use the power ratio to decide what to do.
      }
    }
  }
});

ReminderExpansion.recurrence = function () {
  return 1;
}