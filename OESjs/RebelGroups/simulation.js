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
sim.model.objectTypes = [ "RebelGroup", "Enterprise" ];
sim.model.eventTypes = [ "ReminderIncome", "ReminderDemand", "Extort",
  "Loot", "Flee" ];
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
  initialValue: 10,
  label: "Number Enterprises",
  hint: "The number of enterprises"
};
sim.model.v.fightExpansion = {
  range: "NonNegativeInteger",
  initialValue: 2,
  label: "Expansion per fight",
  hint: "The number of enterprises conquered due to winning a fight"
};


/* Global Functions */
sim.model.f.powerRatio = function ( rebelgroup ) {
  var nmrOfRebels, totalPower = 0, powerfull = 0;
  var powerfullRatio, rebelgroupRatio;
  var rebelgroups = cLASS["RebelGroup"].instances;
  
  Object.keys( rebelgroups ).forEach( function ( objId ) {
    nmrOfRebels = rebelgroups[objId].nmrOfRebels;
    totalPower += nmrOfRebels;
    
    if ( nmrOfRebels > powerfull ) {
      powerfull = nmrOfRebels;
    }
  });
  
  powerfullRatio = powerfull / totalPower;
  rebelgroupRatio = rebelgroup.nmrOfRebels / totalPower;
  
  return powerfullRatio - rebelgroupRatio;
}
/*******************************************************************************
 * Define Initial State
 ******************************************************************************/
// Initial Objects
sim.scenario.initialState.objects = {};

// Initial Events
sim.scenario.initialState.events = [];

// Initial Functions
sim.scenario.setupInitialState = function () {
  var i = 3, objId;
  var nmrHigh, nmrLow;
  var keys, rebelGroup, rebelgroups, enterprise, enterprises;
  
  /**
   * Create Rebel Groups
   */
  /*
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
  sim.addObject( new RebelGroup( {
    id: 1,
    name: "rebelgroup1",
    nmrOfRebels: 500,
    wealth: 100,
    extortionRate: 0.3,
    lastExpansion: 0
  } ) );
  
  sim.scheduleEvent( new ReminderDemand( {
    occTime: 1,
    rebelgroup: 1
  } ) );
  
  sim.addObject( new RebelGroup( {
    id: 2,
    name: "rebelgroup2",
    nmrOfRebels: 100,
    wealth: 200,
    extortionRate: 0.2,
    lastExpansion: 0
  } ) );
  
  sim.scheduleEvent( new ReminderDemand( {
    occTime: 1,
    rebelgroup: 2
  } ) );
  
  /**
   * Create Enterprises
   */
  // Create High Income Enterprises
  nmrHigh = sim.v.nmrOfEnterprises * 0.2;
  for ( ; i <= (sim.v.nmrOfRebelGroups + nmrHigh); i += 1 ) {
    objId = i;
    sim.addObject( new Enterprise( {
      id: objId,
      name: "enterprise" + objId,
      rebelgroup: null,
      wealth: 0,
      meanIncome: 100,
      stdDevIncome: 10
    } ) );
    
    sim.scheduleEvent( new ReminderIncome( {
      occTime: 1,
      enterprise: objId
    } ) );
  }
  
  // Create Low Income Enterprises
  nmrLow = sim.v.nmrOfEnterprises * 0.8;
  for ( ; i <= (sim.v.nmrOfRebelGroups + nmrHigh + nmrLow); i += 1 ) {
    objId = i;
    sim.addObject( new Enterprise( {
      id: objId,
      name: "enterprise" + objId,
      rebelgroup: null,
      wealth: 0,
      meanIncome: 5,
      stdDevIncome: 1
    } ) );
    
    sim.scheduleEvent( new ReminderIncome( {
      occTime: 1,
      enterprise: objId
    } ) );
  }
  
  /**
   * Allocate Enterprises to Rebel Groups
   */
  rebelgroups = cLASS["RebelGroup"].instances;
  keys = Object.keys( rebelgroups );
  enterprises = cLASS["Enterprise"].instances;
  Object.keys( enterprises ).forEach( function (objId) {
    enterprise = enterprises[objId];
    rebelgroup = rebelgroups[ keys[ rand.uniformInt( 0, keys.length - 1) ] ];
    
    enterprise.rebelgroup = rebelgroup;
    rebelgroup.enterprises.push( enterprise );
  });
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
