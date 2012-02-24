owin <- c("Basisonderwijs"
,"Speciaal basisonderwijs"
,"Speciale scholen"
,"Brugjaren voortgezet onderwijs"
,"Praktijkonderwijs"
,"Vmbo"
,"Havo"
,"Vwo"
,"Middelbaar beroepsonderwijs"
,"Hoger beroepsonderwijs"
,"Wetenschappelijk onderwijs"
,"Instroom"
)

owuit <- c("Basisonderwijs"
,"Speciaal basisonderwijs"
,"Speciale scholen"
,"Brugjaren voortgezet onderwijs"
,"Praktijkonderwijs"
,"Vmbo"
,"Havo"
,"Vwo"
,"Middelbaar beroepsonderwijs"
,"Hoger beroepsonderwijs"
,"Wetenschappelijk onderwijs"
,"Uitstroom"
)

stroom <- read.csv("../data/stroom.csv", sep=";")
rownames(stroom) <- stroom[,1]
m <- as.matrix(stroom[-1])
dimnames(m) <- list("in"=owin, "uit"=owuit)

m <- cbind(m, Instroom=0)
m <- rbind(m, Uitstroom=0)

nms <- unique(c(owin, owuit))
m <- m[nms,nms]

nodes <- diag(m)

ar <- apply(m, 1, function(r) paste(r, collapse=", "))
ar <- paste("[",ar,"]", collapse=",\n")
writeLines(ar, "../data/matrix.txt")
diag(m) <- 0

idx <- which(m != 0)
from <- ((idx - 1) %% nrow(m)) + 1
to <- ((idx - 1) %/% ncol(m)) + 1

dat <- data.frame( Source=from
                 , Target=to
                 , Weight=m[idx]
                 )

write.csv(dat, "../data/edges.csv", row.names=FALSE)

nodedat <- data.frame( Id=seq_along(nodes)
                     , Label=names(nodes)
                     , Value=nodes
                     )
                   
write.csv(nodedat, "../data/nodes.csv", row.names=FALSE)