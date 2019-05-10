library(data.table)

baseDir <- "/data/workspace/btu/RebelGroups"

experiments <- list()
experiments[[1]] <- c("sec4-1-1_strength-definition.csv",
                       "sec4-1-1_strength-summary.csv",
                       "sec4-1-1_strength.csv")

experiments[[2]] <- c("sec4-1-2_allocation-definition.csv",
                       "sec4-1-2_allocation-summary.csv",
                       "sec4-1-2_allocation.csv")

experiments[[3]] <- c("sec4-2-2_SO1-definition.csv",
                       "sec4-2-2_SO1-summary.csv",
                       "sec4-2-2_SO1.csv")

experiments[[4]] <- c("sec4-2-2_SO2-definition.csv",
                       "sec4-2-2_SO2-summary.csv",
                       "sec4-2-2_SO2.csv")

experiments[[5]] <- c("sec4-2-2_SO3-definition.csv",
                       "sec4-2-2_SO3-summary.csv",
                       "sec4-2-2_SO3.csv")

experiments[[6]] <- c("sec4-2-2_SO3x-definition.csv",
                       "sec4-2-2_SO3x-summary.csv",
                       "sec4-2-2_SO3x.csv")

for(experiment in experiments) {
  pathDef <- paste0(baseDir, "/data/", experiment[1])
  pathSum <- paste0(baseDir, "/data/", experiment[2])

  definition <- data.table(read.csv(pathDef, sep=";"))
  summary <- data.table(read.csv(pathSum, sep=";"))

  header <- c(names(definition)[2:3])
  for(k in 2:length(names(summary))) {
    header <- c(header,
                paste0("Mean_", names(summary)[k]),
                paste0("Sd_", names(summary)[k]))
  }

  output <- NULL
  for(i in unique(definition$experimentScenarioNo)) {
    expIds <- as.character(definition[which(experimentScenarioNo == i),]$id)

    data <- summary[which(as.character(id) %in% expIds),]

    line <- c(as.character(definition[which(experimentScenarioNo == i),2:3][1]))

    for(j in 2:length(names(data))) {
      aux <- as.matrix(data[, ..j])
      line <- c(line, mean(aux), sd(aux))
    }

    output <- rbind(output, line)
  }

  output <- data.table(output)
  setnames(output, names(output), header)

  outputFile = paste0(baseDir, "/output/", experiment[3])
  write.table(output, file=outputFile, sep=";", col.names=TRUE,
              row.names=FALSE, quote=FALSE)
}