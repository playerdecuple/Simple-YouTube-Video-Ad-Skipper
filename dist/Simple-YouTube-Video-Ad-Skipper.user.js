// ==UserScript==
// @name         Simple YouTube Video Ad-Skipper
// @namespace    https://github.com/playerdecuple/Simple-Youtube-Video-Ad-Skipper
// @supportURL   https://github.com/playerdecuple/Simple-YouTube-Video-Ad-Skipper/issues
// @updateURL    https://github.com/playerdecuple/Simple-YouTube-Video-Ad-Skipper/raw/main/dist/Simple-YouTube-Video-Ad-Skipper.user.js
// @version      1.0.0
// @description  Remove all YouTube video advertising content without using ad-blocking extensions!
// @author       playerdecuple (https://github.com/playerdecuple)
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// ==/UserScript==




(function YouTubeAdSkipper() {

    /*
     * A table of DOM selector
     */

    const $$ = {
        video: "video",
        adOverlay: ".ytp-ad-module",
        adInfo: ".ytp-ad-player-overlay-layout__ad-info-container",
        adSequel: ".video-ads.ytp-ad-module",
        skipButton: ".ytp-ad-skip-button-modern.ytp-button"
    };


    /*
     * DOM Variables
     */

    let $video;

    let $adOverlay;

    let $adSequel;

    let $skipButton;

    let $$interval;



    /*
     * Methods for updating DOM elements
     */

    // Update a 'video' element.
    const _updateVideo = () => {
        if ($video == null || !document.contains($video))
            $video = document.querySelector($$.video);
    };

    // Update an adversity overlay element.
    const _updateAdversityOverlay = () => {
        if ($adOverlay == null || !document.contains($adOverlay))
            $adOverlay = document.querySelector($$.adOverlay);
    };

    // Update a non-video advertising element.
    const _updateAdversitySequel = () => {
        if ($adSequel == null || !document.contains($adSequel))
            $adSequel = document.querySelector($$.adSequel);
    };

    // Update a skip button.
    const _updateSkipButton = () => {
        if ($skipButton == null || !document.contains($skipButton))
            $skipButton = document.querySelector($$.skipButton);
    };



    /*
     * Service methods
     */


    const log = (...str) => console.warn("Simple YouTube Video Ad-Skipper:", ...str);


    // The practical skip method.
    const _skip = () => {
        const isShowingAdversity = window.getComputedStyle($adOverlay).display != "none";

        if (isShowingAdversity) {
            log("Advertisement content was detected and automatically skipped.");
            $video.pause();

            try {
                const $adInfo = $adOverlay.querySelector($$.adInfo);
                const [ adMinutes, adSeconds ] = $adInfo.innerText.match(/\d+:\d+/)[0].split(":");
                const totalSeconds = adMinutes * 60 + adSeconds * 1;

                $video.currentTime += totalSeconds;
            } catch (e) {
                // Ignore
            } finally {
                $video.play();
            }
        }
    }


    // Service Callback
    const serviceCallback = () => {
        if (!location.pathname.startsWith("/watch"))
            return;

        _updateVideo() || _updateAdversityOverlay() || _updateAdversitySequel() || _updateSkipButton();

        if ($adSequel != null && $skipButton != null)
            return $skipButton.click();

        _skip();
    };


    // Starts service.
    const _startService = () => {
        clearInterval($$interval);
        $$interval = setInterval(_ => serviceCallback(), 10);
    };



    /*
     * Initialize
     */

    (() => {
        log("An instance initialized.");
        _updateAdversityOverlay() || _updateVideo() || _startService();
    })();

})();