export default (state = {}, action) => {
    switch (action.type) {
        case 'EXAMPLE_ACTION':
            return {
                result: action.payload
            }
        default:
            return state
    }
}