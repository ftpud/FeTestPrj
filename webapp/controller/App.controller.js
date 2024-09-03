sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
], (Controller, MessageToast, JSONModel, formatter) => {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.App", {
        formatter: formatter,

        onInit() {

            this.audio = new Audio();
            this.audio.preload = "metadata";
            this.audio.src = "http://localhost:8080/resources/test_data/Alegro.mp3";

            // set data model on view
            const playerInfo = {
                currentItem: {
                    isFavorite: false
                },
                playerState: {
                    shuffleEnabled: false,
                    isPlaying: false,
                    duration: 0,
                    position: 0,
                    nowPlaying: ""
                }
            };

            const playerModel = new JSONModel(playerInfo);
            this.getView().setModel(playerModel, 'player');


            var oModel = new JSONModel(sap.ui.require.toUrl("data/data.json"));
            this.getView().setModel(oModel);


            this.audio.onplaying = (event) => {
                this.getView().getModel('player').setProperty("/playerState/isPlaying", true);
            };

            this.audio.onpause = (event) => {
                this.getView().getModel('player').setProperty("/playerState/isPlaying", false);
            };

            this.audio.ontimeupdate = (event) => {
                this.getView().getModel('player').setProperty("/playerState/position", this.audio.currentTime);
            };

            this.audio.ondurationchange = (event) => {
                this.getView().getModel('player').setProperty("/playerState/duration", this.audio.duration);
            };


            this.audio.onloadedmetadata = (event) => {
                if (this.audio.duration == Infinity) {
                    this.audio.currentTime = 1e101;
                    //this.audio.ontimeupdate = () => {
                    //    this.ontimeupdate = () => {
                   //         return;
                    //    }
                    //    this.audio.currentTime = 0;
                    //    return;
                    //}
                }
            };

        },


        playPress() {
            this.audio.play();
        },

        pausePress() {
            this.audio.pause();
        },

        onSeek(oEvent) {

            this.audio.currentTime = oEvent.getParameter("value");
        },

        itemPressed(oEvent) {
            var oItem = oEvent.getSource();
            this.loadFile(oItem.getBindingContext());
        },

        loadFile(oItem) {
            this.audio.src = oItem.getProperty("url");
            this.audio.currentTime = 0;
            this.audio.play();

            this.getView().getModel('player').setProperty("/playerState/nowPlaying", oItem.getProperty("title"));
        },
    });
});