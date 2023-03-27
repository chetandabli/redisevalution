const validation = (req, res, next)=>{
    let city = req.params.city;
    if(city){
        let temp = true;
        for(let i = 0; i < city.length; i++){
            if(city[i] == "1" || city[i] == "2" || city[i] == "3" || city[i] == "4" || city[i] == "5" || city[i] == "6" || city[i] == "7" || city[i] == "8" || city[i] == "9" || city[i] == "0" || city[i] == "!" || city[i] == "@" || city[i] == "#" || city[i] == "$"){
                temp = false
                res.status(400).json({"msg": "must be a valide city name!"})
            }
        }
        if(temp){
            next()
        }
    }else{
        res.status(400).json({"msg": "city name must be provided!"})
    }
}

module.exports = {
    validation
}