"use strict";export function createGrpcServer(r){return{handle(e){return r.configure({protocol:"grpc",handler:(c,n)=>e({request:c,context:n,services:r.services})})}}}
//# sourceMappingURL=server.js.map
