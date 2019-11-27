library(data.table)

baseDir <- "/data/workspace/btu/RebelGroups"

## Experiment filenames
experiment <- list()
experiment[[1]] <- c("sec4-2-2_SO1-definition.csv",
                     "sec4-2-2_SO1-summary.csv")

experiment[[2]] <- c("sec4-2-2_SO2-definition.csv",
                     "sec4-2-2_SO2-summary.csv")

experiment[[3]] <- c("sec4-2-2_SO3-definition.csv",
                     "sec4-2-2_SO3-summary.csv")

experiment[[4]] <- c("sec4-2-2_SO3x-definition.csv",
                     "sec4-2-2_SO3x-summary.csv")

outputFile <- paste0(baseDir, "/output/", "sec4-2-2_somalia-analysis.csv")

## Output metrics to analyze
metrics <- c("nmrOfExtortions", "nmrOfLoots", "nmrOfExpands", "nmrOfAlliances",
             "nmrOfFights", "nmrOfReports", "nmrOfFlees", "nmrOfRecruits",
             "nmrOfExpels", "nmrOfDeaths")

definition <- NULL
summary <- NULL
for(i in 1:length(experiment)) {
  pathDef <- paste0(baseDir, "/data/", experiment[[i]][1])
  pathSum <- paste0(baseDir, "/data/", experiment[[i]][2])

  definition <- rbind(definition, data.table(read.csv(pathDef, sep=";")))
  summary <- rbind(summary, data.table(read.csv(pathSum, sep=";")))
}

scenarios <- unique(definition$experimentRun)
output <- lapply(1:length(metrics),
                 function(x) {
                   matrix(NA, nrow=length(scenarios), ncol=length(scenarios))
                 }
                )
for(i in 1:length(scenarios)) {
  for(j in 1:length(scenarios)) {
    expI <- as.character(
      definition[which(experimentRun == scenarios[i]),]$id)
    expJ <- as.character(
      definition[which(experimentRun == scenarios[j]),]$id)

    dataI <- summary[which(as.character(id) %in% expI),]
    dataJ <- summary[which(as.character(id) %in% expJ),]

    for(k in 1:length(metrics)) {
      metricI <- as.matrix(subset(dataI, , metrics[k]))
      metricJ <- as.matrix(subset(dataJ, , metrics[k]))

      output[[k]][i,j] <- wilcox.test(metricI, metricJ)$p.value
    }
  }
}

for(i in 1:length(metrics)) {
  write(metrics[i], file=outputFile, append=TRUE)

  aux <- output[[i]]
  write.table(aux, file=outputFile, sep=";", quote=FALSE, append=TRUE,
              col.names=FALSE, row.names=FALSE)
}