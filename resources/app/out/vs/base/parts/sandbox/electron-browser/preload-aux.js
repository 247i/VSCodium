/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";(function(){const{ipcRenderer:n,webFrame:t,contextBridge:i}=require("electron");function o(e){if(!e?.startsWith("vscode:"))throw new Error(`Unsupported event IPC channel '${e}'`);return!0}const s={ipcRenderer:{send(e,...r){o(e)&&n.send(e,...r)},invoke(e,...r){return o(e),n.invoke(e,...r)}},webFrame:{setZoomLevel(e){typeof e=="number"&&t.setZoomLevel(e)}}};try{i.exposeInMainWorld("vscode",s)}catch(e){console.error(e)}})();
//# sourceMappingURL=https://github.com/VSCodium/sourcemaps/releases/download/stable-807ba2d6075c29587f884698cd7370c81ab0724c/core/vs/base/parts/sandbox/electron-browser/preload-aux.js.map
