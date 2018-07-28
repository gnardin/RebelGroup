/*******************************************************************************
 * Mafia simulation model metadata information
 * 
 * @copyright Copyright 2017-2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 * @author Jakub Lelo
 ******************************************************************************/
var sim = sim || {};
sim.model = sim.model || {};
sim.scenario = sim.scenario || {};
sim.config = sim.config || {};

var oes = oes || {};
oes.ui = oes.ui || {};
oes.ui.explanation = {};

/*******************************************************************************
 * Simulation Model
 ******************************************************************************/
sim.model.name = "RebelGroups-1";
sim.model.title = "Rebel Groups Protection Rackets";
sim.model.systemNarrative =
    "<p>Rebel groups all over the world sell protection: "+
    "Latin American gangs, the Japanese <em>Yakuza</em>, the Russian Mafia, and the main Mafia organizations "+
    "operating in Italy: the Sicilian Mafia called <em>Cosa Nostra</em>, the <em>Sacra Corona Unita</em> in Puglia, "
        + "the <em>`Ndrangheta</em> in Calabria, and the <em>Camorra</em> in Campania. </p> " +
    "<p>Some of these groups provide genuine protection deterring thieves and other criminals " +
    "from exploiting businesses, while others practice pure extortion and only offer not " +
    "harming their ‘buyers’. </p>"
        + "<p>Protection rackets harm the societies and economies in which they operate in multiple ways. " +
    "They harm those that they extort by taking their resources, providing little in return, " +
    "and inflicting violence upon those who refuse to pay them. " +
    "Even groups that provide real protection facilitate illegal transactions and allow " +
    "markets for illegal, and frequently harmful, goods and services, to exist. " +
    "They may also enforce cartels among businesses, increasing costs and hurting consumers. </p>"
sim.model.shortDescription =
    "<p>The model defines three object types: RebelGroup, Enterprise and Household."
        + "Enterprises typically represent farming or trading businesses. </p> "
sim.model.source =
    "L.G. Nardin, G. Andrighetto, R. Conte, Á. Székely, D. Anzola, C. Elsenbroich, U. Lotzmann, "
        + "M. Neumann, V. Punzo and K.G. Troitzsch. 2016. <a href='https://dx.doi.org/10.1007%2fs10458-016-9330-z'>Simulating "
        + "Protection Rackets: A Case Study of the Sicilian Mafia</a>. <i>Journal of Autonomous Agents and Multi-Agent Systems</i>. "
        + "30(6):1117-1147.";
sim.model.license = "CC BY-NC";
sim.model.creator = "Frances Duffy, Kamil Klosek, Luis Gustavo Nardin, Gerd Wagner";
sim.model.created = "2018-07-26";
sim.model.modified = "2018-07-26";
