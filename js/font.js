// Generated by CoffeeScript 1.12.6
(function() {
  var EmbeddedFont, PDFFont, StandardFont, fontkit;

  // fontkit = require('fontkit');

  PDFFont = (function() {
    PDFFont.open = function(document, src, family, id) {
      var font;
      if (typeof src === "string") {
        if (StandardFont.isStandardFont(src)) {
          return new StandardFont(document, src, id);
        }
        font = fontkit.openSync(src, family);
      } else if (Buffer.isBuffer(src)) {
        font = fontkit.create(src, family);
      } else if (src instanceof Uint8Array) {
        font = fontkit.create(new Buffer(src), family);
      } else if (src instanceof ArrayBuffer) {
        font = fontkit.create(new Buffer(new Uint8Array(src)), family);
      }
      if (font == null) {
        throw new Error("Not a supported font format or standard PDF font.");
      }
      return new EmbeddedFont(document, font, id);
    };

    function PDFFont() {
      throw new Error("Cannot construct a PDFFont directly.");
    }

    PDFFont.prototype.encode = function(text) {
      throw new Error("Must be implemented by subclasses");
    };

    PDFFont.prototype.widthOfString = function(text) {
      throw new Error("Must be implemented by subclasses");
    };

    PDFFont.prototype.ref = function() {
      return this.dictionary != null
        ? this.dictionary
        : (this.dictionary = this.document.ref());
    };

    PDFFont.prototype.finalize = function() {
      if (this.embedded || this.dictionary == null) {
        return;
      }
      this.embed();
      return (this.embedded = true);
    };

    PDFFont.prototype.embed = function() {
      throw new Error("Must be implemented by subclasses");
    };

    PDFFont.prototype.lineHeight = function(size, includeGap) {
      var gap;
      if (includeGap == null) {
        includeGap = false;
      }
      gap = includeGap ? this.lineGap : 0;
      return ((this.ascender + gap - this.descender) / 1000) * size;
    };

    return PDFFont;
  })();

  module.exports = PDFFont;

  StandardFont = require("./font/standard");

  EmbeddedFont = require("./font/embedded");
}.call(this));
