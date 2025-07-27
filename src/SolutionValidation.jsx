// determine if the current workspace state is a equivalent to provided solution data
function checkSolution(workspaceState, solution) {
    const currentGraph = buildWorkspaceGraph(workspaceState.devices, workspaceState.edges);

    // sort solution data
    let sortedSolution = solution.map(node => ({
        type: node.type,
        neighbors: [...node.neighbors].map(n => [n[0], ...n.slice(1).sort()]).sort(
            (a, b) => a[0].localeCompare(b[0]) || JSON.stringify(a.slice(1)).localeCompare(JSON.stringify(b.slice(1)))
        )
    })).sort((a, b) => a.type.localeCompare(b.type));

    // sort each component and compare with the solution - if any component matches, this
    // is a solution, we don't care about extra devices strewn about the workspace
    for (const component of currentGraph) {
        let sortedComponent = component.map(node => ({
            type: node.type,
            neighbors: [...node.neighbors].map(n => [n[0], ...n.slice(1).sort()]).sort(
                (a, b) => a[0].localeCompare(b[0]) || JSON.stringify(a.slice(1)).localeCompare(JSON.stringify(b.slice(1)))
            )
        })).sort((a, b) => a.type.localeCompare(b.type));
        if (checkSolutionSingleComponent(sortedComponent, sortedSolution)) return true;
    }
    return false;
}

// determines if a single component matches a solution
function checkSolutionSingleComponent(component, solution) {

    // if there are different numbers of components, this is not a correct solution
    if (component.length !== solution.length) return false;

    for (let i = 0; i < component.length; i++) {

        // if type doesn't match, this is not a correct solution
        if (component[i].type !== solution[i].type) return false;

        // if number of neighbors is off or a neighbor doesn't match, this is not a correct solution
        const neighbors1 = component[i].neighbors;
        const neighbors2 = solution[i].neighbors;
        if (neighbors1.length !== neighbors2.length) return false;
        for (let j = 0; j < neighbors1.length; j++) {
            const [type1, ...edges1] = neighbors1[j];
            const [type2, ...edges2] = neighbors2[j];

            if (type1 !== type2) return false;
            if (edges1.length !== edges2.length) return false;
            for (let k = 0; k < edges1.length; k++) {
                if (edges1[k] !== edges2[k]) return false;
            }
        }
    }
    return true;
}

// builds a graph representation of the current workspace - will occur
// each time that graph updates, which is terrible, but doesn't matter much
// here since the graphs we're working with are very small.
function buildWorkspaceGraph(devices, edges) {

    // adjacency list
    const deviceMap = new Map();
    const adjacency = new Map();
    for (const device of devices) {
        deviceMap.set(device.id, { type: device.deviceType, id: device.id });
        adjacency.set(device.id, []);
    }
    for (const edge of edges) {
        const { deviceid1, deviceid2, edgeType } = edge;
        adjacency.get(deviceid1).push({ id: deviceid2, edgeType });
        adjacency.get(deviceid2).push({ id: deviceid1, edgeType });
    }

    // bfs through each individual component and add it to the array
    const visited = new Set();
    const components = [];
    for (const [id] of deviceMap) {
        if (visited.has(id)) continue;

        const stack = [id];
        const componentNodes = [];

        while (stack.length > 0) {
            const currentId = stack.pop();
            if (visited.has(currentId)) continue;

            visited.add(currentId);
            const currentDevice = deviceMap.get(currentId);
            const neighborMap = new Map();

            for (const neighbor of adjacency.get(currentId)) {
                const neighborDevice = deviceMap.get(neighbor.id);
                const key = neighborDevice.type;

                if (!neighborMap.has(key)) {
                    neighborMap.set(key, new Set());
                }
                neighborMap.get(key).add(neighbor.edgeType);

                if (!visited.has(neighbor.id)) {
                    stack.push(neighbor.id);
                }
            }

            const neighbors = [];
            for (const [type, edgeTypes] of neighborMap.entries()) {
                neighbors.push([type, ...Array.from(edgeTypes).sort()]);
            }

            componentNodes.push({ type: currentDevice.type, neighbors: neighbors });
        }
        components.push(componentNodes);
    }
    return components;
}

export default checkSolution;