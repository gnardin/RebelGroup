# Rebel Group Protection Rackets

`Rebel Group Protection Rackets` is an agent-based simulation model of protection rackets in a civil war conflict inside a weak or failed state that attempts to capture the decision-making and behavior of the actors involved.

## Software Pre-requisite

The model is written in JavaScript using the OESjs simulation framework. Thus, the only software to run the simulation model is any modern web browser like Firefox, Google Chrome, and Opera.

The script used for data analysis is written in [**R Statistics**](https://www.r-project.org/), thus it can be run on any R-supported operating system. In addition to **R v3.5.0+**, the script uses a library that need to be installed prior to execution:

* `data.table v.1.12`

## Execute Simulation Online

The model is available online at [https://gnardin.github.io/RebelGroups](https://gnardin.github.io/RebelGroups) as a web-based simulation and can be run in any modern web browser (tested on Firefox and Google Chrome).

## Execute Simulation Offline

### Download Simulator from GitHub

* Open a terminal
* Navigate to the directory where you want to download the CRUST code
* Type: **git clone https://github.com/gnardin/RebelGroups.git**

The directory created by cloning the RebelGroups repository will henceforth be referred as ``<rebelDir>``.

The description of the content of each directory under `<rebelDir>` is provided in the table below.

| **Directory**       | **Description**                         |
|---------------------|-----------------------------------------|
| _data_              | Compressed data generated based on the experimental settings reported on the article Duffy, F. S., Klosek, K. C., Nardin, L. G., &amp; Wagner, G. (under review). Rebel group protection rackets: Simulating the effects of economic support on civil war violence. _Computational Conflict Research_. Computational Social Sciences Book Series. Cham: Springer.|
| _script_            | Scripts used to generate the statistics of the files in the _data_ directory.
| _OESjs/framework_   | OESjs simulator framework source-code   |
| _OESjs/RebelGroups_ | RebelGroups simulation mode source-code |

### Execute the simulation

To execute the simulation, open the file `<rebelDir>/OESjs/RebelGroups/simulation`

### Execute the analysis script

* Open a terminal
* Navigate to the `<rebelDir>/data` folder
* Unzip the data file using command `unzip data.zip`
* Navigate to the `<rebelDir>/script` folder
* Edit the _analysis.R_ script file and set the `baseDir` parameter with the full path to the base directory (i.e., `<rebelDir>`).
* Execute: **Rscript analysis.R --no-save**