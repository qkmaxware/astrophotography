window.site = (function(){
    var exports = {};

    // region Image Tools
    function lazyload_hires(img) {
        if (!img.dataset.hires) {
            // No hi-res version
            return;
        }
        else if (img.dataset.src != img.dataset.hires) {
            // Current image isn't the hi-res version
            img.src = img.dataset.hires;
            img.dataset.src = img.dataset.hires;
            return;
        }
    }
    exports.photos = {
        lazyload_hires
    };
    // end region

    return exports;
})();