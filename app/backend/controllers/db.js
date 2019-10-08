module.exports.modelBinder = (model, modelName) => {
	return (req, res, next) => {
		if(!req.models) {
			req.models = {}
		}
		req.models[modelName] = model
		next()
	}
}