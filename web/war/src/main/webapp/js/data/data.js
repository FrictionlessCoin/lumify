
define([
    'flight/lib/component',
    './withPublicApi',
    './withBrokenWorkerConsole',
    './withDataRequestHandler',
    './withCurrentUser',
    './withWebsocket',
    './withLegacyWebsocket',
    './withObjectSelection',
    './withObjectsUpdated',
    './withWorkspaces',
    './withWorkspaceVertexDrop',
    'util/withDataRequest'
], function(
    defineComponent
    // mixins auto added in order (change index of slice)
) {
    'use strict';

    var PATH_TO_WORKER = 'jsc/data/web-worker/data-worker.js',
        mixins = Array.prototype.slice.call(arguments, 1);

    return defineComponent.apply(null, [Data].concat(mixins));

    function Data() {

        this.after('initialize', function() {
            this.setupDataWorker();
        });

        this.setupDataWorker = function() {
            this.worker = new Worker(PATH_TO_WORKER);
            this.worker.onmessage = this.onDataWorkerMessage.bind(this);
            this.worker.onerror = this.onDataWorkerError.bind(this);
        };

        this.onDataWorkerError = function(event) {
            console.error('data-worker error', event);
        };

        this.onDataWorkerMessage = function(event) {
            var data = event.data;

            if (data.type && (data.type in this)) {
                this[data.type](event.data);
            } else {
                console.warn('Unhandled message from worker', event.data);
            }
        };

    }
});