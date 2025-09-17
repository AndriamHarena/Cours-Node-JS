exports.handleError = (res, message, error) => {
    if(error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message, data: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "Une erreur s'est produite, réessayez dans quelques instants.", data: null });
}