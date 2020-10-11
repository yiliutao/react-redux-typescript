let initState = {
    netApi: {},
    localApi: {},
};
function clearState() {
    initState = {
        netApi: {},
        localApi: {},
    };
}
function getInitState() {
    return initState;
}
export { getInitState, clearState };