let totalExperimentData = {
    TotalClicks: 0,
    CorrectClicks: 0,
    AvgMouseDist: 0,
    AvgTime: 0,
    TotalTime: 0,
    TotalColls: 0,
    Times: [],
    MouseDists: [],

}

let roundExperimentData = {
    Clicks: 0,
    MouseDist: 0,
    TimeTaken: 0,
    Colls: 0
}

let roundNumber = 1;

function resetRoundExperimentData() {
    roundExperimentData = {
        Clicks: 0,
        MouseDist: 0,
        TimeTaken: 0,
        Colls: 0
    }
}


const ExperimentController = {
    getRoundExperimentData: () => {
        return roundExperimentData
    },

    getTotalExperimentData: () => {
        return totalExperimentData;
    },
    
    getRoundNumber: () => {
        return roundNumber;
    },
    
    resetRoundNumber: () => {
        return roundNumber = 1;
    },

    cleanExperimentData: () => {
        let distSum = totalExperimentData.MouseDists.reduce((partialSum, a) => partialSum + a, 0);
        let timeSum = totalExperimentData.Times.reduce((partialSum, a) => partialSum + a, 0);
        totalExperimentData.AvgMouseDist = distSum / totalExperimentData.MouseDists.length;
        totalExperimentData.AvgTime = timeSum / totalExperimentData.Times.length;

    },  
    
    advanceRound: () => {
        roundNumber += 1;

        console.log(roundExperimentData);
    
        totalExperimentData.TotalClicks += roundExperimentData.Clicks;
        totalExperimentData.CorrectClicks += 1;
        totalExperimentData.TotalTime += roundExperimentData.TimeTaken;
        totalExperimentData.TotalColls += roundExperimentData.Colls;
        totalExperimentData.MouseDists.push(roundExperimentData.MouseDist);
        totalExperimentData.Times.push(roundExperimentData.TimeTaken);

        ExperimentController.cleanExperimentData();
    
        resetRoundExperimentData();
    },
    
    incClicks: () => {
        roundExperimentData.Clicks += 1
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

