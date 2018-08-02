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
/*******************************************************************************
 * Simulation Parameters
 ******************************************************************************/
sim.scenario.simulationEndTime = 3650;
sim.scenario.idCounter = 1; // optional
//sim.scenario.randomSeed = 1; // optional
/*******************************************************************************
 * Simulation Config
 ******************************************************************************/
// sim.config.stepDuration = 0; // optional
// sim.config.createLog = false; // optional
// sim.config.userInteractive = false; // optional
// sim.config.visualize = false; // optional
/*******************************************************************************
 * Simulation Model
 ******************************************************************************/
sim.model.time = "discrete";
sim.model.timeUnit = "D"; // days
sim.model.timeIncrement = 1; // optional

/* Object, Event, and Activity types */
sim.model.objectTypes = ["RebelGroup", "Enterprise"];
sim.model.eventTypes =
    ["ReminderIncome", "ReminderDemand", "Extort", "Loot", "Flee"];
sim.model.activityTypes = [];

/* Global Variables */
sim.model.v.nmrOfRebelGroups = {
  range: "NonNegativeInteger",
  initialValue: 2,
  label: "Number Rebel Groups",
  hint: "The number of rebel groups"
};
sim.model.v.nmrOfEnterprises = {
  range: "NonNegativeInteger",
  initialValue: 100,
  label: "Number Enterprises",
  hint: "The number of enterprises"
};

/* Global Functions */

/*******************************************************************************
 * Define Initial State
 ******************************************************************************/
// Initial Objects
sim.scenario.initialState.objects = {
    "1": {
      typeName: "RebelGroup",
      name: "rebelgroup1",
      nmrOfRebels: 500,
      wealth: 100,
      extortionRate: 0.3,
      lastExpansion: 0
    },
    "2": {
      typeName: "RebelGroup",
      name: "rebelgroup2",
      nmrOfRebels: 100,
      wealth: 200,
      extortionRate: 0.2,
      lastExpansion: 0
    }
};

// Initial Events
sim.scenario.initialState.events = [
  {
    typeName: "ReminderDemand",
    occTime: 1,
    rebelgroup: 1
  },
  {
    typeName: "ReminderDemand",
    occTime: 1,
    rebelgroup: 2
  }
];

// Initial Functions
sim.scenario.setupInitialState = function () {
  var i = 3, objId;
  var nmrHigh, nmrLow;
  
  /*
  // Create Rebel Groups
  for ( i = 1; i <= sim.v.nmrOfRebelGroups; i += 1 ) {
    objId = i;
    sim.addObject( new RebelGroup( {
      id: objId,
      name: "rebelgroup" + objId,
      nrmOfRebels: 0,
      wealth: 0,
      extortionRate: 0.3,
      lastExpansion: 0
    } ) );
    
    sim.scheduleEvent( new ReminderDemand( {
      occTime: 1,
      rebelgroup: objId
    } ) );
  }*/
  
  // Create Enterprises High Income
  nmrHigh = sim.v.nmrOfEnterprises * 0.2;
  for ( ; i <= (sim.v.nmrOfRebelGroups + nmrHigh); i += 1 ) {
    objId = i;
    sim.addObject( new Enterprise( {
      id: objId,
      name: "enterprise" + objId,
      wealth: 0,
      meanIncome: 100,
      stdDevIncome: 10
    } ) );
    
    sim.scheduleEvent( new ReminderIncome( {
      occTime: 1,
      enterprise: objId
    } ) );
  }
  
  //Create Enterprises Low Income
  nmrLow = sim.v.nmrOfEnterprises * 0.8;
  for ( ; i <= (sim.v.nmrOfRebelGroups + nmrHigh + nmrLow); i += 1 ) {
    objId = i;
    sim.addObject( new Enterprise( {
      id: objId,
      name: "enterprise" + objId,
      wealth: 0,
      meanIncome: 5,
      stdDevIncome: 1
    } ) );
    
    sim.scheduleEvent( new ReminderIncome( {
      occTime: 1,
      enterprise: objId
    } ) );
  }
};

/*******************************************************************************
 * Define Output Statistics Variables
 ******************************************************************************/
sim.model.statistics = {
  "extortions": {
    range: "NonNegativeInteger",
    label: "Number Extortions",
    initialValue: 0
  },
  "lootings": {
    range: "NonNegativeInteger",
    label: "Number Lootings",
    initialValue: 0
  },
  "amountExtLoot": {
    range: "Decimal",
    label: "Amount Ext/Loot",
    initialValue: 0
  },
  "flees": {
    range: "NonNegativeInteger",
    label: "Number Flees",
    initialValue: 0
  }
};
