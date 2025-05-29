const { SlashCommandBuilder } = require('discord.js');
const { GetGoldData } = require('../../functions.js');
const { GoldEmbed } = require('../../embeds.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gold')
		.setDescription('Altın Piyasası')
        .addStringOption(option =>
            option.setName('sunucular')
                .setDescription('Sunucu Seçin')
                .setRequired(true)
                .addChoices(
                    { name: 'Amerika', value: 'Amerika' },
                    { name: 'Asya', value: 'Asya' },
                    { name: 'Avrupa', value: 'Avrupa' },
                )),
	async execute(interaction) {
        const server = interaction.options.getString('sunucular');
        const { res } = await GetGoldData(server);
        await interaction.reply({ 
            embeds: [
                await GoldEmbed(res[0].price, res[0].timestamp, server)
            ],
            ephemeral: true
        })
	},
};
