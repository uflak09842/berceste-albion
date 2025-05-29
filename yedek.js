const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { GetGuildData, GetPlayerData } = require('../../functions');
const { sunucuId, kurucuId } = require('../../config.json');
const { OyuncuEmbed, KdEmbed, PvEEmbed, GatherEmbed, DigerEmbed } = require('../../embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping'),
    async execute(interaction) {
        const client = interaction.client;
        const guild = await client.guilds.fetch(sunucuId);
        const member = await guild.members.fetch(kurucuId);
        const userAvatar = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

        const { res, KillFame, DeathFame, kills, fame, deaths, ratio } = await GetGuildData();
    
        const embed = new EmbedBuilder()
        .setAuthor({ name: res.guild.FounderName || 'SUCUKBABA', iconURL: userAvatar || 'https://i.imgur.com/AfFp7pu.png'})
        .setTitle(res.Name || 'Berceste')
        .addFields(
            { name: '`Fame`', value: '**' + fame + '**'},
            { name: '`Kill Fame`', value: '**' + KillFame + '**', inline: true},
            { name: '`Death Fame`', value: '**' + DeathFame + '**', inline: true},
            { name: ' ', value: ' ' },
            { name: '`Öldürme`', value: '**' + kills + '**' , inline: true},
            { name: '`Ölme`', value: '**' + deaths + '**' , inline: true},
            { name: '`Oran`', value: '**' + ratio + '**' , inline: true},
            { name: '`Kuruluş`', value: '`20/10/2024`', inline: true},
            { name: '`Üyeler`', value: '`' + res.basic.memberCount + '`', inline: true},
            { name: '`▼ En İyi 5 Oyuncu ▼`', value: ' '},
        )
        .setColor('#2E405C')
        .setTimestamp()
        
        const playerRes1 = await GetPlayerData(res.topPlayers[0].Id)
        const oyuncu1 = new ButtonBuilder()
			.setCustomId('oyuncu_1')
			.setLabel(playerRes1.playerRes.Name || '1. Oyuncu')
			.setStyle(ButtonStyle.Secondary);

        const playerRes2 = await GetPlayerData(res.topPlayers[1].Id);
        const oyuncu2 = new ButtonBuilder()
            .setCustomId('oyuncu_2')
            .setLabel(playerRes2.playerRes.Name || '2. Oyuncu')
            .setStyle(ButtonStyle.Secondary);

        const playerRes3 = await GetPlayerData(res.topPlayers[2].Id);
        const oyuncu3 = new ButtonBuilder()
            .setCustomId(`oyuncu_3`)
            .setLabel(playerRes3.playerRes.Name || '3. Oyuncu')
            .setStyle(ButtonStyle.Secondary);

        const playerRes4 = await GetPlayerData(res.topPlayers[3].Id);
        const oyuncu4 = new ButtonBuilder()
            .setCustomId(`oyuncu_4`)
            .setLabel(playerRes4.playerRes.Name || '4. Oyuncu')
            .setStyle(ButtonStyle.Secondary);

        const playerRes5 = await GetPlayerData(res.topPlayers[4].Id);
        const oyuncu5 = new ButtonBuilder()
            .setCustomId(`oyuncu_5`)
            .setLabel(playerRes5.playerRes.Name || '5. Oyuncu')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
        .addComponents( oyuncu1, oyuncu2, oyuncu3, oyuncu4, oyuncu5 );

        const kdButton = new ButtonBuilder()
        .setCustomId('kdBut')
        .setLabel('KD İstatistikleri')
        .setStyle(ButtonStyle.Secondary);

        const pveButton = new ButtonBuilder()
        .setCustomId('pveBut')
        .setLabel('PvE İstatistikleri')
        .setStyle(ButtonStyle.Secondary);

        const gatherButton = new ButtonBuilder()
        .setCustomId('gatherBut')
        .setLabel('Gather İstatistikleri')
        .setStyle(ButtonStyle.Secondary);

        const digerButton = new ButtonBuilder()
        .setCustomId('digerBut')
        .setLabel('Diğer İstatistikler')
        .setStyle(ButtonStyle.Secondary);

        const row2 = new ActionRowBuilder()
        .addComponents( kdButton, pveButton, gatherButton, digerButton );

        const response = await interaction.reply({ embeds: [embed], components: [row]})

        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'oyuncu_1') {
                await confirmation.update({ embeds: 
                    [await KdEmbed(
                        playerRes1.playerRes.Name, playerRes1.playerRes.KillFame, playerRes1.playerRes.DeathFame, playerRes1.playerRes.FameRatio,
                    )], 
                    components: [row2]
                });

                const res2 = await interaction.editReply({ embeds: [embed], components: [row2]})
                const conf2 = await res2.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                if(conf2.customId === 'kdBut') {
                    await conf2.update({ embeds: 
                        [await KdEmbed(
                            playerRes1.playerRes.Name, playerRes1.playerRes.KillFame, playerRes1.playerRes.DeathFame, playerRes1.playerRes.FameRatio,
                        )],
                    });
                } else if(conf2.customId === 'pveBut') {
                    await conf2.update({ embeds: 
                        [await PvEEmbed(
                            playerRes1.playerRes.Name,
                            playerRes1.playerRes.LifetimeStatistics.PvE.Royal,
                            playerRes1.playerRes.LifetimeStatistics.PvE.Outlands,
                            playerRes1.playerRes.LifetimeStatistics.PvE.Avalon,
                            playerRes1.playerRes.LifetimeStatistics.PvE.Hellgate,
                            playerRes1.playerRes.LifetimeStatistics.PvE.CorruptedDungeon,
                            playerRes1.playerRes.LifetimeStatistics.PvE.Mists,
                            playerRes1.playerRes.LifetimeStatistics.PvE.Total,
                        )],
                    });
                } else if(conf2.customId === 'gatherBut' ) {
                    await conf2.update({ embeds: 
                        [await GatherEmbed(
                            playerRes1.playerRes.Name, 
                            playerRes1.playerRes.LifetimeStatistics.Gathering.Fiber.Total,
                            playerRes1.playerRes.LifetimeStatistics.Gathering.Hide.Total,
                            playerRes1.playerRes.LifetimeStatistics.Gathering.Ore.Total,
                            playerRes1.playerRes.LifetimeStatistics.Gathering.Rock.Total,
                            playerRes1.playerRes.LifetimeStatistics.Gathering.Wood.Total,
                            playerRes1.playerRes.LifetimeStatistics.Gathering.All.Total,
                        )],
                    });
                } else if(conf2.customId === 'digerBut' ) {
                    await conf2.update({ embeds: 
                        [await DigerEmbed(
                            playerRes1.playerRes.Name, 
                            playerRes1.playerRes.LifetimeStatistics.Crafting.Total,
                            playerRes1.playerRes.LifetimeStatistics.CrystalLeague,
                            playerRes1.playerRes.LifetimeStatistics.FishingFame,
                            playerRes1.playerRes.LifetimeStatistics.FarmingFame,
                        )],
                    });
                }
            } else if (confirmation.customId === 'oyuncu_2') {
                await confirmation.update({ embeds: 
                    [await KdEmbed(
                        playerRes2.playerRes.Name, playerRes2.playerRes.KillFame, playerRes2.playerRes.DeathFame, playerRes2.playerRes.FameRatio,
                    )], 
                    components: [row2] 
                });
            } else if (confirmation.customId === 'oyuncu_3') {
                await confirmation.update({ embeds: 
                    [await KdEmbed(
                        playerRes3.playerRes.Name, playerRes3.playerRes.KillFame, playerRes3.playerRes.DeathFame, playerRes3.playerRes.FameRatio,
                    )], 
                    components: [row2] 
                });
            } else if (confirmation.customId === 'oyuncu_4') {
                await confirmation.update({ embeds: 
                    [await KdEmbed(
                        playerRes4.playerRes.Name, playerRes4.playerRes.KillFame, playerRes4.playerRes.DeathFame, playerRes4.playerRes.FameRatio,
                    )], 
                    components: [row2] 
                });
            } else if (confirmation.customId === 'oyuncu_5') {
                await confirmation.update({ embeds: 
                    [await KdEmbed(
                        playerRes5.playerRes.Name, playerRes5.playerRes.KillFame, playerRes5.playerRes.DeathFame, playerRes5.playerRes.FameRatio,
                    )], 
                    components: [row2] 
                });
            }

        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'Butona Tıklanırken Bir Hata Meydana Geldi !', components: [], embeds: [], ephemeral: true });
        }
    },
};