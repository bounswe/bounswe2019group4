module.exports.modelBinder = (model, modelName) => {
	return (req, res, next) => {
		if(!req.models) {
			req.models = {}
		}
		req.models[modelName] = model
		next()
	}
}

module.exports.multipleModelBinder = (spec) => {
	return (req, res, next) => {
		if(!req.models) {
			req.models = {}
		}
		if(Array.isArray(spec)) {
			spec.forEach(model => {
				req.models[model[1]] = model[0]
			});
		} else {
			throw Error('Invalid argument given to modelBinder middleware.')
		}
		next()
	}
}