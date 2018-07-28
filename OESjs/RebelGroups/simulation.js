/*******************************************************************************
 * Simulation Parameters
 ******************************************************************************/
sim.scenario.simulationEndTime = 3650;
//sim.scenario.idCounter = 0; // optional
sim.scenario.randomSeed = 1; // optional
/*******************************************************************************
 * Simulation Config
 ******************************************************************************/
// sim.config.stepDuration = 0;  // optional
sim.config.createLog = false;  // optional
// sim.config.userInteractive = false;  // optional
// sim.config.visualize = false;  // optional
/*******************************************************************************
 * Simulation Model
 ******************************************************************************/
sim.model.time = "discrete";
sim.model.timeUnit = "D"; // days
// sim.model.timeIncrement = 1; // optional

/* Object, Event, and Activity types */
sim.model.objectTypes = ["RebelGroup", "Enterprise", "Household"];
sim.model.eventTypes = [
  //Household
  //"ReceiveIncome",
  //Household-Enterprise
  "Purchase",
  // RebelGroup-Enterprise
  //"Extortion", "Looting",
  // RebelGroup
  //"Recruitment", "Desertion"
];
sim.model.activityTypes = [];

/* Global Variables */
sim.model.v.nmrOfRebelGroups = {
    range: "NonNegativeInteger",
    initialValue: 10,
    label: "Number of Rebel Groups"
  };
sim.model.v.nmrOfEnterprises = {
  range: "PositiveInteger",
  initialValue: 100,
  label: "Number of Enterprises"
};
sim.model.v.nmrOfHouseholds = {
  range: "PositiveInteger",
  initialValue: 1000,
  label: "Number of Households"
};
/*******************************************************************************
 * Define Initial State
 ******************************************************************************/
// Initial Objects
sim.scenario.initialState.objects = {
};

// Initial Events
sim.scenario.initialState.events = [
  {typeName: "Purchase", occTime: 1}
];

// Initial Functions
sim.scenario.setupInitialState = function () {
  var i;
  
  // Create Rebel Groups
  for ( i = 0; i < sim.v.nmrOfRebelGroups; i += 1 ) {
    sim.addObject( new RebelGroup( {
      id: i,
      name: "rebelgroup" + i
    } ) );
  }
  
  // Create Entrepreneurs
  for ( ; i < sim.v.nmrOfEnterprises; i += 1 ) {
    sim.addObject( new Enterprise( {
      id: i,
      name: "enterprise" + i
    } ) );
  }
  
  // Create Households
  for ( ; i < sim.v.nmrOfHouseholds; i += 1 ) {
    sim.addObject( new Household( {
      id: i,
      name: "household" + i
    } ) );
    
    /* Create ReminderPurchase event
    sim.scheduleEvent( new ReminderPurchase( {
      occTime: 1,
      household: i
    } ) ); */
  }
};

/*******************************************************************************
 * Define Output Statistics Variables
 ******************************************************************************/
sim.model.statistics = {
};
