/*******************************************************************************
 * Flee event class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Flee = new cLASS( {
  Name: "Flee",
  supertypeName: "eVENT",
  properties: {
    "enterprise": {
      range: "Enterprise"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var rebelGroup, index;
      var rebelGroupsObj = cLASS[ "RebelGroup" ].instances;

      Object.keys( rebelGroupsObj ).forEach( ( objId ) => {
        rebelGroup = rebelGroupsObj[ objId ];

        index = rebelGroup.extortedEnterprises.indexOf( this.enterprise );
        if ( index !== -1 ) {
          rebelGroup.extortedEnterprises.splice( index, 1 );
        }
      } );

      sim.removeObject( this.enterprise );

      sim.stat.nmrOfFlees += 1;

      return followupEvents;
    }
  }
} );