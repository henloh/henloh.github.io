/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
window.addEventListener("load",function(){"use strict";var e=new URL("./js/ace/",document.baseURI).href;var r=new Map;window.addEventListener("message",function(e){var a=e.data.message;var n=e.data.workerId;var i=e.origin;if(a.createWorker){var s=t(a.workerUrl,i,n);if(s){r.set(n,s)}}else if(a.terminateWorker){r.get(n).worker.terminate();r.delete(n)}else if(i===r.get(n).creatorOrigin){r.get(n).worker.postMessage(a)}});function t(r,t,a){if(!r||typeof r!=="string"){return null}var n=new URL(r,document.baseURI).href;if(!n.startsWith(e)){return null}var i=new Worker(n);i.addEventListener("message",function(e){e.data.workerId=a;window.parent.postMessage(e.data,t)});return{creatorOrigin:t,worker:i}}});