let totalExperimentData = {
    TotalClicks: 0,
    CorrectClicks: 0,
    AvgMouseDist: 0,
    TotalTime: 0,
    TotalColls: 0,
    Times: [],
}

let roundExperimentData = {
    TotalClicks: 0,
    MouseDist: 0,
    TimeTaken: 0,
    Colls: 0
}

let roundNumber = 1;

function resetRoundExperimentData() {
    roundExperimentData = {
        TotalClicks: 0,
        MouseDist: 0,
        TimeTaken: 0,
        Colls: 0
    }
}


const ExperimentController = {
    getRoundExperimentData: () => {
        return roundExperimentData
    },
    
    getRoundNumber: () => {
        return roundNumber
    },
    
    advanceRound: () => {
        roundNumber += 1;
    
        totalExperimentData.TotalClicks += roundExperimentData.TotalClicks;
        totalExperimentData.CorrectClicks += 1;
        totalExperimentData.TotalTime += roundExperimentData.TimeTaken;
        totalExperimentData.TotalColls += roundExperimentData.Colls;
        totalExperimentData.AvgMouseDist = (totalExperimentData.AvgMouseDist + roundExperimentData.MouseDist)/roundNumber;
        totalExperimentData.AvgTimePerRound = (totalExperimentData.AvgTimePerRound + roundExperimentData.TimeTaken)/roundNumber;
        totalExperimentData.Times.push(roundExperimentData.TimeTaken);
    
        resetRoundExperimentData();
    },
    
    incTotalClicks: () => {
        roundExperimentData.TotalClicks += 1
    },
    
    incColls: () => {
        roundExperimentData.Colls += 1
    },
    
    setMouseDist: (dist) => {
        roundExperimentData.MouseDist = dist
    },
    
    setTimeTaken: (timeTaken) => {
        roundExperimentData.TimeTaken = timeTaken 
    }
}  

