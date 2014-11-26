cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.dalog.six/sockets.tcp.js",
        "id": "org.dalog.six.sockets.tcp",
        "clobbers": [
            "chrome.sockets.tcp"
        ]
    },
    {
        "file": "plugins/org.chromium.common/events.js",
        "id": "org.chromium.common.events",
        "clobbers": [
            "chrome.Event"
        ]
    },
    {
        "file": "plugins/org.chromium.common/errors.js",
        "id": "org.chromium.common.errors"
    },
    {
        "file": "plugins/org.chromium.common/stubs.js",
        "id": "org.chromium.common.stubs"
    },
    {
        "file": "plugins/org.chromium.common/helpers.js",
        "id": "org.chromium.common.helpers"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.dalog.six": "1.4.0",
    "org.chromium.common": "1.0.4",
    "org.chromium.iossocketscommon": "1.0.1"
}
// BOTTOM OF METADATA
});