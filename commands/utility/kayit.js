const { SlashCommandBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kayit')
		.setDescription('Kullanıcıyı Kayıt Eder'),
	async execute(interaction) {
        const modal = new ModalBuilder()
        .setCustomId('myModal')
        .setTitle('Üye Kayıt');

		const isim = new TextInputBuilder()
        .setCustomId('isim')
        .setLabel("İsim Girin.")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(30)
        .setMinLength(2)
        .setRequired(true);

        const nick = new TextInputBuilder()
        .setCustomId('nick')
        .setLabel("Oyun İçi İsmi Girin.")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(30)
        .setMinLength(2)
        .setRequired(true);

        const yas = new TextInputBuilder()
        .setCustomId('yas')
        .setLabel("Yaş Girin.")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(3)
        .setMinLength(1)
        .setRequired(true);

        const isimActionRow = new ActionRowBuilder().addComponents(isim);
        const nickActionRow = new ActionRowBuilder().addComponents(nick);
        const yasActionRow = new ActionRowBuilder().addComponents(yas);

        modal.addComponents(isimActionRow, nickActionRow, yasActionRow);

        await interaction.showModal(modal);
	},
};
