// Generated by CoffeeScript 1.12.6
(function() {
    var JPEG, fs,
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    // fs = require('fs');

    JPEG = (function() {
        var MARKERS;

        MARKERS = [0xFFC0, 0xFFC1, 0xFFC2, 0xFFC3, 0xFFC5, 0xFFC6, 0xFFC7, 0xFFC8, 0xFFC9, 0xFFCA, 0xFFCB, 0xFFCC, 0xFFCD, 0xFFCE, 0xFFCF];

        function JPEG(data, label) {
            var channels, marker, pos;
            this.data = data;
            this.label = label;
            if (this.data.readUInt16BE(0) !== 0xFFD8) {
                throw "SOI not found in JPEG";
            }
            pos = 2;
            while (pos < this.data.length) {
                marker = this.data.readUInt16BE(pos);
                pos += 2;
                if (indexOf.call(MARKERS, marker) >= 0) {
                    break;
                }
                pos += this.data.readUInt16BE(pos);
            }
            if (indexOf.call(MARKERS, marker) < 0) {
                throw "Invalid JPEG.";
            }
            pos += 2;
            this.bits = this.data[pos++];
            this.height = this.data.readUInt16BE(pos);
            pos += 2;
            this.width = this.data.readUInt16BE(pos);
            pos += 2;
            channels = this.data[pos++];
            this.colorSpace = (function() {
                switch (channels) {
                    case 1:
                        return 'DeviceGray';
                    case 3:
                        return 'DeviceRGB';
                    case 4:
                        return 'DeviceCMYK';
                }
            })();
            this.obj = null;
        }

        JPEG.prototype.embed = function(document) {
            if (this.obj) {
                return;
            }
            this.obj = document.ref({
                Type: 'XObject',
                Subtype: 'Image',
                BitsPerComponent: this.bits,
                Width: this.width,
                Height: this.height,
                ColorSpace: this.colorSpace,
                Filter: 'DCTDecode'
            });
            if (this.colorSpace === 'DeviceCMYK') {
                this.obj.data['Decode'] = [1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0];
            }
            this.obj.end(this.data);
            return this.data = null;
        };

        return JPEG;

    })();

    module.exports = JPEG;

}).call(this);
