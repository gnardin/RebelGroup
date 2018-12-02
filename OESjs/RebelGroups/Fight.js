/*******************************************************************************
 * Fight event class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Fight = new cLASS( {
  Name: "Fight",
  supertypeName: "eVENT",
  properties: {
    "attacker": { range: "RebelGroup", label: "Attacker" },
    "opponent": { range: "RebelGroup", label: "Opponent" }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var enterprise, enterprises, index, len, i, j;
      var ally, allyProb, allied, attackerAlliance, opponentAlliance;
      var strong, strongProb;
      var weak, weakProb;
      var rebelGroup, nmrOfExtorted, nmrOfRebels, nmrTransfer, totalTransfer;
      var rebelGroups = cLASS[ "RebelGroup" ].instances;
      var rebelGroupsKeys = Object.keys( rebelGroups );

      /* Define whether to Form Alliance */
      ally = false;
      if ( this.attacker.nmrOfRebels > this.opponent.nmrOfRebels ) {
        allyProb = ( sim.model.f.globalRelativeStrength( this.attacker ) -
          sim.model.f.globalRelativeStrength( this.opponent ) );

        if ( rand.uniform() < allyProb ) {
          ally = true;
        }
      }

      /* Choose an Ally */
      attackerAlliance = {
        leader: this.attacker,
        members: [ this.attacker.id ],
        nmrOfExtorted: this.attacker.extortedEnterprises.length,
        nmrOfRebels: this.attacker.nmrOfRebels
      };
      opponentAlliance = {
        leader: this.opponent,
        members: [ this.opponent.id ],
        nmrOfExtorted: this.opponent.extortedEnterprises.length,
        nmrOfRebels: this.opponent.nmrOfRebels
      };
      if ( ally ) {
        rebelGroupsKeys.splice(
          rebelGroupsKeys.indexOf( this.attacker.id ), 1 );
        rebelGroupsKeys.splice(
          rebelGroupsKeys.indexOf( this.opponent.id ), 1 );
        rand.shuffleArray( rebelGroupsKeys );

        allied = false;
        for ( i = 0; ( i < rebelGroupsKeys.length ) & !allied; i += 1 ) {
          rebelGroup = rebelGroups[ rebelGroupsKeys[ i ] ];
          if ( ( opponentAlliance.nmrOfRebels + rebelGroup.nmrOfRebels ) >
            this.attacker.nmrOfRebels ) {
            opponentAlliance.members.push( rebelGroup.id );
            opponentAlliance.nmrOfExtorted +=
              rebelGroup.extortedEnterprises.length;
            opponentAlliance.nmrOfRebels += rebelGroup.nmrOfRebels;
            allied = true;

            sim.stat.nmrOfAlliances += 1;
          }
        }
      }

      /* Define the strong and weak rebel groups */
      if ( this.attacker.nmrOfRebels > opponentAlliance.nmrOfRebels ) {
        strong = attackerAlliance;
        weak = opponentAlliance;
      } else {
        strong = opponentAlliance;
        weak = attackerAlliance;
      }

      // Rebel Groups fight only if both have rebels
      if ( ( strong.nmrOfRebels > 0 ) || ( weak.nmrOfRebels > 0 ) ) {
        strongProb = sim.model.f.relativeStrength( strong, weak );
        weakProb = sim.model.f.relativeStrength( weak, strong );

        // Probability the strong Rebel Group wins the fight
        if ( rand.uniform() < strongProb ) {

          // Define number of Enterprises to transfer
          len = Math.min( weak.nmrOfExtorted, sim.v.fightExpansion );

          // Proportion to transfer from each weak Rebel Group
          totalTransfer = 0;
          nmrTransfer = [];
          for ( i = 0; i < weak.members.length; i += 1 ) {
            nmrOfExtorted =
              rebelGroups[ weak.members[ i ] ].extortedEnterprises.length;
            nmrOfRebels = rebelGroups[ weak.members[ i ] ].nmrOfRebels;
            nmrTransfer[ i ] = Math.min( Math.ceil( nmrOfExtorted *
              ( nmrOfRebels / weak.nmrOfRebels ) ), len - totalTransfer );
            totalTransfer += nmrTransfer[ i ];
          }

          // Select random Enterprises from weak Rebel Group
          enterprises = [];
          for ( i = 0; i < weak.members.length; i += 1 ) {
            rebelGroup = rebelGroups[ weak.members[ i ] ];
            for ( j = 0; j < nmrTransfer[ i ]; j += 1 ) {
              index = rand.uniformInt( 0,
                rebelGroup.extortedEnterprises.length - 1 );
              enterprises.push( rebelGroup.extortedEnterprises[ index ] );
              rebelGroup.extortedEnterprises.splice( index, 1 );
            }
          }

          // Proportion to transfer to each strong Rebel Group
          totalTransfer = 0;
          nmrTransfer = [];
          for ( i = 0; i < strong.members.length; i += 1 ) {
            nmrOfRebels = rebelGroups[ strong.members[ i ] ].nmrOfRebels;
            nmrTransfer[ i ] = Math.min( Math.ceil( enterprises.length *
              ( nmrOfRebels / strong.nmrOfRebels ) ), len - totalTransfer );
            totalTransfer += nmrTransfer[ i ];
          }

          // Transfer Enterprises to strong Rebel Groups
          rand.shuffleArray( enterprises );
          for ( i = 0; i < strong.members.length; i += 1 ) {
            rebelGroup = rebelGroups[ strong.members[ i ] ];
            for ( j = 0; j < nmrTransfer[ i ]; j += 1 ) {
              enterprise = enterprises.splice( 0, 1 );
              enterprise.rebelGroup = rebelGroup;
              enterprise.nmrOfLootings = 0;
              rebelGroup.extortedEnterprises =
                rebelGroup.extortedEnterprises.concat( enterprise );
            }
          }
        } else {

          // Probability the weak Rebel Group wins the fight
          if ( rand.uniform() < weakProb ) {

            // Define number of Enterprises to transfer
            len = Math.min( strong.nmrOfExtorted, sim.v.fightExpansion );

            // Proportion to transfer from each strong Rebel Group
            totalTransfer = 0;
            nmrTransfer = [];
            for ( i = 0; i < strong.members.length; i += 1 ) {
              nmrOfExtorted =
                rebelGroups[ strong.members[ i ] ].extortedEnterprises.length;
              nmrOfRebels = rebelGroups[ strong.members[ i ] ].nmrOfRebels;
              nmrTransfer[ i ] = Math.min( Math.ceil( nmrOfExtorted *
                ( nmrOfRebels / strong.nmrOfRebels ) ), len - totalTransfer );
              totalTransfer += nmrTransfer[ i ];
            }

            // Select random Enterprises from strong Rebel Group
            enterprises = [];
            for ( i = 0; i < strong.members.length; i += 1 ) {
              rebelGroup = rebelGroups[ strong.members[ i ] ];
              for ( j = 0; j < nmrTransfer[ i ]; j += 1 ) {
                index = rand.uniformInt( 0,
                  rebelGroup.extortedEnterprises.length - 1 );
                enterprises.push( rebelGroup.extortedEnterprises[ index ] );
                rebelGroup.extortedEnterprises.splice( index, 1 );
              }
            }

            // Proportion to transfer to each weak Rebel Group
            totalTransfer = 0;
            nmrTransfer = [];
            for ( i = 0; i < weak.members.length; i += 1 ) {
              nmrOfRebels = rebelGroups[ weak.members[ i ] ].nmrOfRebels;
              nmrTransfer[ i ] = Math.min( Math.ceil( enterprises.length *
                ( nmrOfRebels / weak.nmrOfRebels ) ), len - totalTransfer );
              totalTransfer += nmrTransfer[ i ];
            }

            // Transfer Enterprises to weak Rebel Groups
            rand.shuffleArray( enterprises );
            for ( i = 0; i < weak.members.length; i += 1 ) {
              rebelGroup = rebelGroups[ weak.members[ i ] ];
              for ( j = 0; j < nmrTransfer[ i ]; j += 1 ) {
                enterprise = enterprises.splice( 0, 1 );
                enterprise.rebelGroup = rebelGroup;
                enterprise.nmrOfLootings = 0;
                rebelGroup.extortedEnterprises =
                  rebelGroup.extortedEnterprises.concat( enterprise );
              }
            }
          }
        }

        // Fight decreases RG size proportional to opposite RG's strength
        for ( i = 0; i < strong.members.length; i += 1 ) {
          rebelGroup = rebelGroups[ strong.members[ i ] ];
          rebelGroup.nmrOfRebels -= Math.ceil( rebelGroup.nmrOfRebels *
            weakProb );
        }

        for ( i = 0; i < weak.members.length; i += 1 ) {
          rebelGroup = rebelGroups[ weak.members[ i ] ];
          rebelGroup.nmrOfRebels -= Math.ceil( rebelGroup.nmrOfRebels *
            strongProb );
        }

        sim.stat.nmrOfFights += 1;
      }

      return followupEvents;
    }
  }
} );