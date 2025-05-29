const { EmbedBuilder } = require('discord.js');

async function KlanEmbed(res, KillFame, DeathFame, kills, fame, deaths, ratio, ownerAvatar) {
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
        )
        .setColor('#2E405C')
        .setTimestamp()

    return embed;
};

async function KdEmbed( userAvatar, name, ukFame, udFame, ufRatio) {
    const kFame = ukFame.toLocaleString('tr-TR');
    const dFame = udFame.toLocaleString('tr-TR');
    const fRatio = ufRatio.toLocaleString('tr-TR');

    const kdEmbed = new EmbedBuilder()
        .setTitle(name || 'Oyuncu')
        .setColor('#2E405C')
        .setThumbnail(userAvatar || 'https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .addFields(
            { name: 'Öldürme', value: '**' + kFame + '** <:pvpFame:1301116511456464906> ' || 'bulunamadı', inline: true },
            { name: 'Ölme', value: '**' + dFame + '** <:pvpFame:1301116511456464906>' || 'bulunamadı', inline: true },
            { name: 'Öldürme/Ölme Oranı', value: '**' + fRatio + '** <:pvpFame:1301116511456464906>' || 'bulunamadı' },
        );

    return kdEmbed;
};

async function PvEEmbed(name, uRoyal, uOutlands, uAvalon, uHellGate, uCorruptedDungeon, uMists, uTotal) {
    const royal = uRoyal.toLocaleString('tr-TR');
    const outlands = uOutlands.toLocaleString('tr-TR');
    const avalon = uAvalon.toLocaleString('tr-TR');
    const hellGate = uHellGate.toLocaleString('tr-TR');
    const corruptedDungeon = uCorruptedDungeon.toLocaleString('tr-TR');
    const mists = uMists.toLocaleString('tr-TR');
    const total = uTotal.toLocaleString('tr-TR');

    const pveEmbed = new EmbedBuilder()
    .setTitle(name || 'Oyuncu')
    .setColor('#2E405C')
    .setTimestamp()
    .addFields(
        { name: '**PvE İstatistikleri**', value: ' '},
        { name: 'Royal', value: royal + ' <:pveFame:1301116536882462720>' || 'bilinmiyor', inline: true},
        { name: 'Outlands', value: outlands + ' <:pveFame:1301116536882462720>' || 'bilinmiyor', inline: true},
        { name: 'Avalon', value: avalon + ' <:pveFame:1301116536882462720>' || 'bilinmiyor', inline: true},
        { name: ' ', value: ' '},
        { name: 'Hell Gate', value: hellGate + ' <:pveFame:1301116536882462720>' || 'bilinmiyor', inline: true},
        { name: 'Corrupted Dungeon', value: corruptedDungeon + ' <:pveFame:1301116536882462720>' || 'bilinmiyor', inline: true},
        { name: 'Mists', value: mists + ' <:pveFame:1301116536882462720>' || 'bilinmiyor', inline: true},
        { name: ' ', value: ' '},
        { name: 'Toplam', value: total + ' <:pveFame:1301116536882462720>' || 'bilinmiyor'},
    );

    return pveEmbed;
};

async function GatherEmbed(name, ufibTotal, uhideTotal, uoreTotal, urockTotal, uwoodTotal, ufinalTotal) {
    const fibTotal = ufibTotal.toLocaleString('tr-TR');
    const hideTotal = uhideTotal.toLocaleString('tr-TR');
    const oreTotal = uoreTotal.toLocaleString('tr-TR');
    const rockTotal = urockTotal.toLocaleString('tr-TR');
    const woodTotal = uwoodTotal.toLocaleString('tr-TR');
    const finalTotal = ufinalTotal.toLocaleString('tr-TR');

    const gatherEmbed = new EmbedBuilder()
    .setTitle(name || 'Oyuncu')
    .setColor('#2E405C')
    .setTimestamp()
    .addFields(
        { name: '**Toplayıcılık İstatistikleri**', value: ' '},
        { name: 'Lif', value: fibTotal + ' <:lif:1301121265909895199>' || 'bilinmiyor', inline: true},
        { name: 'Deri', value: hideTotal + ' <:deri:1301122141206351913>'|| 'bilinmiyor', inline: true},
        { name: 'Cevher', value: oreTotal + ' <:cevher:1301124386086064139>'|| 'bilinmiyor', inline: true},
        { name: ' ', value: ' '},
        { name: 'Taş', value: rockTotal + ' <:tas:1301125047339057222>' || 'bilinmiyor', inline: true},
        { name: 'Odun', value: woodTotal + ' <:odun:1301119685361668167>' || 'bilinmiyor', inline: true},
        { name: 'Topladığı Toplam Kaynak', 
            value: '**' + finalTotal + '**' + 
            ' <:lif:1301121265909895199> ' + 
            ' <:deri:1301122141206351913> ' + 
            ' <:cevher:1301124386086064139> ' + 
            ' <:tas:1301125047339057222> ' + 
            ' <:odun:1301119685361668167>' || 'bilinmiyor'},
    );

    return gatherEmbed;
};

async function DigerEmbed(name, uCraft, uCrystalLeague, uFishFame, uFarmFame) {
    const craft = uCraft.toLocaleString('tr-TR');
    const crystalLeague = uCrystalLeague.toLocaleString('tr-TR');
    const fishFame = uFishFame.toLocaleString('tr-TR');
    const farmFame = uFarmFame.toLocaleString('tr-TR');

    const digerEmbed = new EmbedBuilder()
    .setTitle(name || 'Oyuncu')
    .setColor('#2E405C')
    .setTimestamp()
    .addFields(
        { name: '`Toplam Zanaat`', value: craft || 'bilinmiyor', inline: true},
        { name: '`Kristal Lig`', value: crystalLeague || 'bilinmiyor', inline: true},
        { name: '`Balıkçılık`', value: fishFame + ' <:balik:1301130304487948339>' || 'bilinmiyor', inline: true},
        { name: '`Tarımcılık`', value: farmFame + ' <:bugday:1301139349470969917>' || 'bilinmiyor', inline: true},
    );

    return digerEmbed;
};

async function GoldEmbed(adeger, zaman, server) {
    const deger = adeger.toLocaleString('tr-TR');

    const date = new Date(zaman);
    const formattedDate = date.toLocaleString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const goldEmbed = new EmbedBuilder()
    .setTitle(server || 'Bilinmiyor')
    .addFields(
        {name: `**1 <:altin:1302777118995910656>** =  **${deger} <:gumus:1302777147932413992>**` || 'Bilinmiyor =', value: ' '}, 
        {name: 'Son Güncellenme', value: formattedDate || 'Bilinmiyor'}
    )
    .setFooter({ text: 'verilen değerler tahmini\nolup doğruluk içermemektedir.'})
    .setColor('Gold');

    return goldEmbed;
};

module.exports = {
    KdEmbed,
    PvEEmbed,
    GatherEmbed,
    DigerEmbed,
    GoldEmbed,
    KlanEmbed
};