const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { GetGuildData, GetPlayerData, GetDiscordIdByGameId } = require('../../functions');
const { sunucuId, kurucuId } = require('../../config.json');
const { KdEmbed, PvEEmbed, GatherEmbed, DigerEmbed } = require('../../embeds.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('klan')
        .setDescription('Klan İstatistikleri'),
    async execute(interaction) {
        const client = interaction.client;
        const guild = await client.guilds.fetch(sunucuId);
        const member = await guild.members.fetch(kurucuId);
        const ownerAvatar = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

        const { res, KillFame, DeathFame, kills, fame, deaths, ratio } = await GetGuildData();
        
        const embed = new EmbedBuilder()
        .setAuthor({ name: res.guild.FounderName || 'SUCUKBABA', iconURL: ownerAvatar || 'https://i.imgur.com/AfFp7pu.png'})
        .setTitle(res.Name || 'Berceste')
        .addFields(
            { name: 'Fame', value: '**' + fame + '** <:fame:1301102867502858280>'},
            { name: 'Öldürme', value: '**' + KillFame + '** <:fame:1301102867502858280>', inline: true},
            { name: 'Ölme', value: '**' + DeathFame + '** <:fame:1301102867502858280>', inline: true},
            { name: ' ', value: ' ' },
            { name: 'Öldürme', value: '**' + kills + '**' , inline: true},
            { name: 'Ölme', value: '**' + deaths + '**' , inline: true},
            { name: 'Oran', value: '**' + ratio + '**' , inline: true},
            { name: 'Kuruluş', value: '20/10/2024', inline: true},
            { name: 'Üyeler', value: `**${res.basic.memberCount}**`, inline: true},
            { name: '**▼ En İyi 5 Oyuncu ▼**', value: ' '},
        )
        .setColor('#2E405C')
        .setTimestamp()

        const row = new ActionRowBuilder();
        const players = [];
        
        for(let i = 0; i < res.topPlayers.length; i++) {
            const playerData = await GetPlayerData(res.topPlayers[i].Id);

            const button = new ButtonBuilder()
            .setCustomId(`oyuncu_${i}`)
            .setLabel(playerData.playerRes.Name || `${i}. Oyuncu`)
            .setStyle(ButtonStyle.Secondary);

            row.addComponents(button);
            players.push(playerData.playerRes);
        };

        const response = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true})

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if(confirmation.customId.startsWith('oyuncu_')) {
                const index = parseInt(confirmation.customId.split('_')[1]);
                const player = players[index];

                const dcId = await GetDiscordIdByGameId(player.Id);
                const userId = await guild.members.fetch(dcId);
                const userAvatar = userId.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

                const statsRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('btn_kd')
                        .setLabel('KD')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('btn_pve')
                        .setLabel('PvE')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('btn_gather')
                        .setLabel('Toplayıcılık')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('btn_diger')
                        .setLabel('Diğer')
                        .setStyle(ButtonStyle.Secondary),
                );

                await confirmation.update({
                    embeds: [await KdEmbed(userAvatar, player.Name, player.KillFame, player.DeathFame, player.FameRatio)],
                    components: [statsRow]
                })

                const buttonCollector = confirmation.message.createMessageComponentCollector({
                    filter: collectorFilter,
                    time: 60_000
                });

                buttonCollector.on('collect', async buttonInteraction => {
                    let selectedEmbed;
        
                    if (buttonInteraction.customId === 'btn_kd') {
                        selectedEmbed = await KdEmbed( userAvatar, player.Name, player.KillFame, player.DeathFame, player.FameRatio);
                    } else if (buttonInteraction.customId === 'btn_pve') {
                        selectedEmbed = await PvEEmbed(
                            player.Name,
                            player.LifetimeStatistics.PvE.Royal,
                            player.LifetimeStatistics.PvE.Outlands,
                            player.LifetimeStatistics.PvE.Avalon,
                            player.LifetimeStatistics.PvE.Hellgate,
                            player.LifetimeStatistics.PvE.CorruptedDungeon,
                            player.LifetimeStatistics.PvE.Mists,
                            player.LifetimeStatistics.PvE.Total,
                        );
                    } else if (buttonInteraction.customId === 'btn_gather') {
                        selectedEmbed = await GatherEmbed(
                            player.Name, 
                            player.LifetimeStatistics.Gathering.Fiber.Total,
                            player.LifetimeStatistics.Gathering.Hide.Total,
                            player.LifetimeStatistics.Gathering.Ore.Total,
                            player.LifetimeStatistics.Gathering.Rock.Total,
                            player.LifetimeStatistics.Gathering.Wood.Total,
                            player.LifetimeStatistics.Gathering.All.Total,
                        );
                    } else if (buttonInteraction.customId === 'btn_diger') {
                        selectedEmbed = await DigerEmbed(
                            player.Name, 
                            player.LifetimeStatistics.Crafting.Total,
                            player.LifetimeStatistics.CrystalLeague,
                            player.LifetimeStatistics.FishingFame,
                            player.LifetimeStatistics.FarmingFame,
                        );
                    }
        
                    await buttonInteraction.update({ embeds: [selectedEmbed], components: [statsRow] });
                });

                buttonCollector.on('end', () => {
                    confirmation.editReply({ components: [] });
                });
            }
        } catch (error) {
            if(error.code == 'InteractionCollectorError' && error.message.includes('time')) {
                const embed2 = new EmbedBuilder()
                .setAuthor({ name: res.guild.FounderName || 'SUCUKBABA', iconURL: ownerAvatar || 'https://i.imgur.com/AfFp7pu.png'})
                .setTitle(res.Name || 'Berceste')
                .addFields(
                    { name: 'Fame', value: '**' + fame + '** <:fame:1301102867502858280>'},
                    { name: 'Öldürme', value: '**' + KillFame + '** <:fame:1301102867502858280>', inline: true},
                    { name: 'Ölme', value: '**' + DeathFame + '** <:fame:1301102867502858280>', inline: true},
                    { name: ' ', value: ' ' },
                    { name: 'Öldürme', value: '**' + kills + '**' , inline: true},
                    { name: 'Ölme', value: '**' + deaths + '**' , inline: true},
                    { name: 'Oran', value: '**' + ratio + '**' , inline: true},
                    { name: 'Kuruluş', value: '20/10/2024', inline: true},
                    { name: 'Üyeler', value: `**${res.basic.memberCount}**`, inline: true},
                )
                .setColor('#2E405C')
                .setTimestamp()

                await interaction.editReply({ embeds: [embed2], components: [] });
            } else if(error.code === 10007) {
                await interaction.editReply({ content: 'Kullanıcı Sunucuda Değil !', embeds: [], components: [], ephemeral: true});
            } else {
                console.error("Bir hata meydana geldi:", error);
                if(error.code === 'GuildMembersTimeout') {
                    console.log('Butona Tıklanmadı');
                    return;
                } else {
                    await interaction.followUp({ content: 'Bir hata meydana geldi, lütfen tekrar deneyin.', ephemeral: true });
                }
            };
        }
    },
};