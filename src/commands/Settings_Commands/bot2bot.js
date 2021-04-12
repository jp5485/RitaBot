// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */
const colors = require("../../core/colors");
const db = require("../../core/db");
const logger = require("../../core/logger");
const discord = require("discord.js");

// -------------
// Command Code
// -------------

module.exports.run = function(data)

{
   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (!data.message.isAdmin)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server administrators.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   // ----------------------------------
   // Error if bot2bot param is missing
   // ----------------------------------

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `bot2bot` parameter. Use `" +
         `${data.config.translateCmdShort} help bot2bot\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   // ----------------
   // Execute setting
   // ----------------

   if (data.message.isAdmin)
   {
      bot2bot(data);
   }
};

// ---------------------------------
// bot2bot varible command handaler
// ---------------------------------

const bot2bot = function(data)
{
   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on" || commandVariable1 === "off")
   {
      console.log(commandVariable1);
      return db.updateBot2BotVar(
         data.message.channel.guild.id,
         commandVariable1,
         function(err)
         {
            if (err)
            {
               return logger("error", err);
            }
            var output =
            `:warning: This is extremely experimental, use at your own risk! :warning:\n\n`+
            "**```Bot to Bot Translation```**\n" +
            `Bot to Bot Message translation is now turned : ${commandVariable1}\n\n`;
            data.color = "info";
            data.text = output;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);
         }
      );
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid bot2bot option.\n";

   // -------------
   // Send message
   // -------------

   return sendMessage(data);
};

// ----------------------
// Send message function
// ----------------------

function sendMessage (data)
{
   message.delete(5000);
   const richEmbedMessage = new discord.RichEmbed()
      .setColor(colors.get(data.color))
      .setAuthor(data.bot.username, data.bot.displayAvatarURL)
      .setDescription(data.text)
      .setTimestamp()
      .setFooter("This message will self-destruct in one minute");

   return message.channel.send(richEmbedMessage).then(msg =>
   {
      msg.delete(60000);
   });
}