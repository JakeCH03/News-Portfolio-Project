exports.handleNotFound = (req, res) => {
    res.status(404).send({msg: "Not Found"});
    
}