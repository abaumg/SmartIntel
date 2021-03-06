// ==UserScript==
// @name         OPR Show EXIF Info
// @version      0.1
// @namespace    https://github.com/DeepAQ/SmartIntel
// @description  Show EXIF info of photos in OPR
// @match        *://opr.ingress.com/recon
// @require      https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js
// @require      https://cdn.bootcss.com/exif-js/2.3.0/exif.min.js
// ==/UserScript==

function dms_to_deg(dms)
{
    var d = dms[0];
    var m = dms[1];
    var s = dms[2];

    var deg = d/1 + m/60 + s/3600;
    return deg;
}

(function() {
    var tagsToShow = ['DateTime', 'Make', 'Model', 'Software', 'GPSLatitude', 'GPSLongitude'];

    var getExif = function (url) {
        var img = document.createElement('img');
        img.src = url;
        img.onload = function () {
            EXIF.getData(img, function () {
                var tags = EXIF.getAllTags(this);
                var info = '<strong>[EXIF]</strong><br>';
                for (var key in tagsToShow) {
                    if (tags[tagsToShow[key]]) {
                        info += '<strong>' + tagsToShow[key] + ': </strong>' + tags[tagsToShow[key]] + '<br>';
                    }
                }
                if (tags['GPSLatitude'] && tags['GPSLongitude'])
                {
                    var deglat = dms_to_deg(tags['GPSLatitude']);
                    var deglon = dms_to_deg(tags['GPSLongitude']);
                    info += '<div class="btn-group"><a class="button btn btn-default" target="osm" href="https://www.openstreetmap.org/?mlat=' + deglat + '&amp;mlon=' + deglon + '&amp;zoom=16">OSM</a></div>';
                }

                $('#descriptionDiv').append('<div>' + info + '</div>');
            });
        };
    };

    var tryGetImgUrl = function () {
        var url = $('.center-cropped-img').attr('src');
        if (!url) {
            setTimeout(tryGetImgUrl, 1000);
        } else {
            getExif((url + '=s0').replace('http:', 'https:'));
        }
    };

    tryGetImgUrl();
})();
