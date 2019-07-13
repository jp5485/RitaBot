const translate = require("@vitalets/google-translate-api");
const ISO6391 = require("iso-639-1");
const fn = require("./helpers");

// ----------------------------------
// Fix inconsistencies in lang codes
// ----------------------------------

const langExceptions =
{
   "he": "iw",
   "zh": "zh-cn",
   "ch": "zh-cn"
};

const langInvertException = function(code)
{
   const output = fn.getKeyByValue(langExceptions, code);

   if (output)
   {
      return output;
   }

   return code;
};

// -----------------------------
// Convert language name to ISO
// -----------------------------

const getLangISO = function(lang)
{
   var code;

   if (!(/^[A-z]{2}[A-z]?(?:-[A-z]{2,}?)?$/i).test(lang))
   {
      code = ISO6391.getCode(lang);
   }

   else
   {
      code = lang;
   }

   if (langExceptions.hasOwnProperty(code))
   {
      return langExceptions[code];
   }

   return code;
};

// --------------------------------------
// Language Code Converter and Validator
// --------------------------------------

module.exports = function(lang, single = false)
{
   if (!lang)
   {
      return null;
   }

   if (lang === "default")
   {
      return "default";
   }

   if (lang === "auto")
   {
      return "auto";
   }

   var langs = {
      unchecked: fn.arraySplit(lang, ","),
      valid: [],
      unique: [],
      invalid: []
   };

   langs.unchecked.forEach(language =>
   {
      const langISO = getLangISO(language.trim());

      if (translate.languages.isSupported(langISO))
      {
         if (!langs.unique.includes(langISO))
         {
            langs.unique.push(langISO);
            langs.valid.push({
               iso: langISO,
               name: ISO6391.getName(langInvertException(langISO)),
               native: ISO6391.getNativeName(langInvertException(langISO))
            });
         }
      }

      else
      {
         langs.invalid.push(language.trim());
      }
   });

   // clean up

   langs.invalid = fn.removeDupes(langs.invalid);

   delete langs.unchecked;

   if (single)
   {
      return langs.unique[0];
   }

   return langs;
};
