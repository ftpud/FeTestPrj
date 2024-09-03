sap.ui.define([], () => {
    "use strict";

    return {
        formatTime(sec) {

            if(sec === Infinity) return "?:??";
            var minutes = Math.floor(sec / 60);
            var seconds = (sec % 60).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }
    }
});