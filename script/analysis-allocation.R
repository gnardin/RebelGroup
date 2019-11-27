library(data.table)

baseDir <- "/data/workspace/btu/RebelGroups"

## Experiment filenames
experiment <- c("sec4-1-2_allocation-definition.csv",
                "sec4-1-2_allocation-summary.csv",
                "sec4-1-2_allocation-analysis.csv")

## Output metrics to analyze
metrics <- c("nmrOfExtortions", "nmrOfLoots", "nmrOfExpands", "nmrOfAlliances",
             "nmrOfFights", "nmrOfReports", "nmrOfFlees", "nmrOfRecruits",
             "nmrOfExpels", "nmrOfDeaths")

pathDef <- paste0(baseDir, "/data/", experiment[1])
pathSum <- paste0(baseDir, "/data/", experiment[2])

definition <- data.table(read.csv(pathDef, sep=";"))
summary <- data.table(read.csv(pathSum, sep=";"))

scenarios <- unique(definition$experimentScenarioNo)
output <- lapply(1:length(metrics),
                 function(x) {
                   matrix(NA, nrow=length(scenarios), ncol=length(scenarios))
                 }
                )
for(i in 1:length(scenarios)) {
  for(j in 1:length(scenarios)) {
    expI <- as.character(
      definition[which(experimentScenarioNo == scenarios[i]),]$id)
    expJ <- as.character(
      definition[which(experimentScenarioNo == scenarios[j]),]$id)

    dataI <- summary[which(as.character(id) %in% expI),]
    dataJ <- summary[which(as.character(id) %in% expJ),]

    for(k in 1:length(metrics)) {
      metricI <- as.matrix(subset(dataI, , metrics[k]))
      metricJ <- as.matrix(subset(dataJ, , metrics[k]))

      output[[k]][i,j] <- wilcox.test(metricI, metricJ)$p.value
    }
  }
}

outputFile <- paste0(baseDir, "/output/", experiment[3])
for(i in 1:length(metrics)) {
  write(metrics[i], file=outputFile, append=TRUE)

  aux <- output[[i]]
  write.table(aux, file=outputFile, sep=";", quote=FALSE, append=TRUE,
              col.names=FALSE, row.names=FALSE)
}